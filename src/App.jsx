// src/App.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { Routes, Route, useLocation, useNavigate, Navigate } from 'react-router-dom';
import { CheckCircle, Loader, CreditCard, Globe, Bell, AlertTriangle, Play, Smartphone } from 'lucide-react';

// FIREBASE IMPORTS 
import { db, auth, googleProvider } from './firebase'; 
import { 
  collection, getDocs, doc, setDoc, updateDoc, onSnapshot, arrayUnion
} from 'firebase/firestore'; 
import { signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';

// MERCADO PAGO IMPORT
import { initMercadoPago, Wallet } from '@mercadopago/sdk-react';

// PAYPAL IMPORT
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

// --- DATOS --- 
import { ALL_COURSES } from './content/courses_data'; 
import { ALL_NEWS as STATIC_NEWS } from './content/news_data'; 

// --- COMPONENTES ---
import { COLORS, COURSE_PRICE, formatCurrency } from './utils/constants'; 
import { Button, Badge } from './components/UI';
import NeuralBackground from './components/NeuralBackground';
import Footer from './components/Footer';
import LegalModal from './components/LegalModal';
import SplashScreen from './components/SplashScreen'; 
import NewsBubble from './components/NewsBubble'; 

// --- VISTAS ---
import HomeView from './views/HomeView';
import SubscriptionView from './views/SubscriptionView';
import CourseDetailView from './views/CourseDetailView';
import ProfileView from './views/ProfileView';
import NewsView from './views/NewsView'; 
import ToolDetailView from './views/ToolDetailView';

// CONFIGURACIÓN DE PAGOS
const MP_PUBLIC_KEY = import.meta.env.VITE_MP_PUBLIC_KEY; 
const PAYPAL_CLIENT_ID = import.meta.env.VITE_PAYPAL_CLIENT_ID; 

// URLs DE TUS FUNCIONES EN FIREBASE
const BACKEND_URL = "https://us-central1-weberic-25da5.cloudfunctions.net/createOrder"; 
const VERIFY_PAYPAL_URL = "https://us-central1-weberic-25da5.cloudfunctions.net/verifyPayPalEndpoint";

const PAYPAL_PLAN_ID = "P-5X729325VU782483PNFDX2WY"; 
const MP_SUBSCRIPTION_PLAN_ID = "3bac21d11f4047be91016c280dc0bb33"; 

const RSS_URL = "https://news.google.com/rss/search?q=inteligencia+artificial+tecnologia&hl=es-419&gl=PE&ceid=PE:es-419";
const API_URL = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(RSS_URL)}`;

initMercadoPago(MP_PUBLIC_KEY, { locale: 'es-PE' });

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
};

const getSmartDomain = (sourceName) => {
    const lower = sourceName.toLowerCase().replace(/\s+/g, '');
    if (lower.includes('comercio')) return 'elcomercio.pe';
    if (lower.includes('republica')) return 'larepublica.pe';
    if (lower.includes('rpp')) return 'rpp.pe';
    if (lower.includes('xataka')) return 'xataka.com';
    if (lower.includes('genbeta')) return 'genbeta.com';
    if (lower.includes('applesfera')) return 'applesfera.com';
    if (lower.includes('wired')) return 'wired.com';
    if (lower.includes('techcrunch')) return 'techcrunch.com';
    if (lower.includes('forbes')) return 'forbes.com';
    if (lower.includes('businessinsider')) return 'businessinsider.es';
    if (lower.includes('elpais')) return 'elpais.com';
    if (lower.includes('mundo')) return 'elmundo.es';
    if (lower.includes('vanguardia')) return 'lavanguardia.com';
    if (lower.includes('infobae')) return 'infobae.com';
    if (lower.includes('bbc')) return 'bbc.com';
    if (lower.includes('cnn')) return 'cnn.com';
    if (lower.includes('hipertextual')) return 'hipertextual.com';
    if (lower.includes('computerhoy')) return 'computerhoy.com';
    if (lower.includes('maldita')) return 'maldita.es';
    if (lower.includes('andina')) return 'andina.pe';
    if (lower.includes('peru21')) return 'peru21.pe';
    if (lower.includes('gestion')) return 'gestion.pe';
    return lower.normalize("NFD").replace(/[\u0300-\u036f]/g, "") + ".com";
};

export default function App() {
  const navigate = useNavigate(); 
  const [showSplash, setShowSplash] = useState(true);
  const [finishSplashAnimation, setFinishSplashAnimation] = useState(false);
  
  // ESTADOS
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [isSubscriptionPayment, setIsSubscriptionPayment] = useState(false); 
  const [paymentMethod, setPaymentMethod] = useState('mercadopago'); // 'mercadopago' | 'paypal'
  const [courseToBuy, setCourseToBuy] = useState(null); 
  const [showRefundModal, setShowRefundModal] = useState(false);
  const [legalModalType, setLegalModalType] = useState(null); 
  const [notification, setNotification] = useState(null);
  const [isLoadingPayment, setIsLoadingPayment] = useState(false);
  const [preferenceId, setPreferenceId] = useState(null); 

  const [courses, setCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState(""); 
  const [loadingCourses, setLoadingCourses] = useState(true);
  const [user, setUser] = useState(null); 
  const [userData, setUserData] = useState({ purchasedCourses: [], isSubscribed: false });

  const [liveNews, setLiveNews] = useState(STATIC_NEWS); 

  // --- SOLUCIÓN CRÍTICA: MEMOIZAR OPCIONES DE PAYPAL ---
  // Esto arregla el error de "Minified React error" (pantalla blanca)
  const paypalOptions = useMemo(() => ({
    "client-id": PAYPAL_CLIENT_ID, 
    currency: "USD", 
    intent: isSubscriptionPayment ? "subscription" : "capture",
    vault: true
  }), [isSubscriptionPayment]);

  // EFECTOS DE CARGA
  useEffect(() => {
    const timerExit = setTimeout(() => { setFinishSplashAnimation(true); }, 2500);
    const timerRemove = setTimeout(() => { setShowSplash(false); }, 3000);
    return () => { clearTimeout(timerExit); clearTimeout(timerRemove); };
  }, []);

  useEffect(() => {
    const checkPaymentStatus = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const status = urlParams.get('status');
      const preapproval_id = urlParams.get('preapproval_id'); 
      
      if (user) {
        if (preapproval_id) {
            showNotification("Procesando suscripción...", "info");
            window.history.replaceState({}, document.title, window.location.pathname);
            setShowPaymentModal(false);
        }
        else if (status === 'approved') {
            showNotification("Pago recibido. Tu curso se desbloqueará en breve.", "success");
            window.history.replaceState({}, document.title, window.location.pathname);
            setShowPaymentModal(false);
        }
      }
    };
    if (!loadingCourses && user) checkPaymentStatus();
  }, [user, loadingCourses]); 

  // CARGA DE DATOS
  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await fetch(API_URL);
        const data = await res.json();
        if (data.items && data.items.length > 0) {
          const formattedNews = data.items.map((item, index) => {
            const titleParts = item.title.split(' - ');
            const sourceName = titleParts.length > 1 ? titleParts.pop().trim() : "Tecnología";
            const cleanTitle = titleParts.join(' - ');
            const realDomain = getSmartDomain(sourceName);
            return {
              id: index,
              title: cleanTitle, 
              source: sourceName, 
              category: "IA News",
              date: item.pubDate.split(' ')[0],
              description: "Noticia destacada.",
              link: item.link,
              image: `https://www.google.com/s2/favicons?domain=${realDomain}&sz=128`
            };
          });
          setLiveNews(formattedNews); 
        }
      } catch (error) { console.error("Error noticias:", error); }
    };
    fetchNews();
  }, []);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "courses"));
        const coursesData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setCourses(coursesData.length > 0 ? coursesData : ALL_COURSES);
        setLoadingCourses(false);
      } catch (error) { 
        setCourses(ALL_COURSES); 
        setLoadingCourses(false); 
      }
    };
    fetchCourses();
  }, []);

  // AUTH
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (!currentUser) setUserData({ purchasedCourses: [], isSubscribed: false });
    });
    return () => unsubscribeAuth();
  }, []);

  useEffect(() => {
    if (user) {
        const userDocRef = doc(db, "users", user.uid);
        const unsubscribeSnapshot = onSnapshot(userDocRef, (docSnap) => {
            if (docSnap.exists()) setUserData(docSnap.data());
            else {
                const newUserData = { email: user.email, purchasedCourses: [], isSubscribed: false };
                setDoc(userDocRef, newUserData, { merge: true });
                setUserData(newUserData);
            }
        });
        return () => unsubscribeSnapshot();
    }
  }, [user]);

  const handleLogin = async () => { try { await signInWithPopup(auth, googleProvider); showNotification("¡Bienvenido!", "success"); } catch (error) { showNotification("Error login", "error"); } };
  const handleLogout = async () => { await signOut(auth); navigate('/'); };
  const showNotification = (msg, type = 'success') => { setNotification({ msg, type }); setTimeout(() => setNotification(null), 4000); };

  // --- APERTURA DE MODALES ---
  const initiatePayment = (course) => {
    if (!user) { showNotification("Inicia sesión primero", "error"); handleLogin(); return; }
    setCourseToBuy(course);
    setIsSubscriptionPayment(false); 
    setPreferenceId(null);
    setPaymentMethod('mercadopago'); 
    setShowPaymentModal(true);
  };

  const initiateSubscription = () => {
    if (!user) { showNotification("Inicia sesión para suscribirte", "error"); handleLogin(); return; }
    setIsSubscriptionPayment(true);
    setPreferenceId(null);
    setPaymentMethod('mercadopago'); 
    setShowPaymentModal(true);
  };

  // --- LÓGICA MERCADO PAGO ---
  const createPreference = async () => {
    setIsLoadingPayment(true);
    
    // 1. SUSCRIPCIÓN
    if (isSubscriptionPayment) {
        setTimeout(() => { window.location.href = `https://www.mercadopago.com.pe/subscriptions/checkout?preapproval_plan_id=${MP_SUBSCRIPTION_PLAN_ID}`; }, 1500);
        return; 
    }

    // 2. PAGO ÚNICO
    try {
      if (!courseToBuy) {
          showNotification("Error: No hay curso seleccionado", "error");
          setIsLoadingPayment(false);
          return;
      }

      // Enviamos el email para que MP muestre Yape/Tarjetas correctamente
      const response = await fetch(BACKEND_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
            id: courseToBuy.id, 
            title: courseToBuy.title, 
            price: Number(COURSE_PRICE),
            userId: user.uid,
            email: user.email // IMPORTANTE: Email del usuario
        }), 
      });
      
      const data = await response.json();
      
      if (!response.ok) throw new Error(data.error || "Error en servidor");
      
      if(data.id) {
          setPreferenceId(data.id); 
      } else {
          showNotification("No se pudo generar el pago", "error");
      }
    } catch (error) { 
        console.error(error);
        showNotification("Error conectando con Mercado Pago", "error"); 
    } 
    finally { setIsLoadingPayment(false); }
  };

  // --- LÓGICA PAYPAL ---
  const handlePayPalApprove = async (data, actions) => {
    try {
      if (!isSubscriptionPayment) {
          await actions.order.capture(); 
      }
      showNotification("Verificando pago...", "info");
      
      const response = await fetch(VERIFY_PAYPAL_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
              orderID: data.orderID,
              subscriptionID: data.subscriptionID,
              isSubscription: isSubscriptionPayment,
              courseId: courseToBuy?.id,
              userId: user.uid
          })
      });
      const result = await response.json();
      
      if (result.success) {
          showNotification("¡Pago Exitoso! Curso desbloqueado.", "success");
          setShowPaymentModal(false);
      } else {
          showNotification("Error en verificación.", "error");
      }
    } catch (err) { 
        console.error("Error PayPal:", err);
        showNotification("Error procesando pago.", "error"); 
    }
  };

  return (
    <PayPalScriptProvider options={paypalOptions}>
      <div className={`font-sans ${COLORS.textLight} ${COLORS.bgMain} min-h-screen relative animate-fade-in`}>
        <ScrollToTop />
        <NeuralBackground />

        {notification && (
          <div className={`fixed top-8 left-1/2 transform -translate-x-1/2 z-[100] px-8 py-4 rounded-full shadow-2xl flex items-center gap-4 animate-pop-in ${COLORS.bgCard} border border-[#627D98] ${notification.type === 'error' ? 'text-red-400' : COLORS.textOrange} text-base font-bold`}>
            <CheckCircle size={24} /> {notification.msg}
          </div>
        )}
        
        <Routes>
          <Route path="/" element={<HomeView courses={courses} loadingCourses={loadingCourses} userData={userData} user={user} searchTerm={searchTerm} setSearchTerm={setSearchTerm} handleLogin={handleLogin} handleLogout={handleLogout} openLegalModal={setLegalModalType} />} />
          <Route path="/noticias" element={<NewsView user={user} userData={userData} handleLogin={handleLogin} handleLogout={handleLogout} news={liveNews} />} />
          <Route path="/suscripcion" element={<SubscriptionView onSubscribe={initiateSubscription} isSubscribed={userData?.isSubscribed} user={user} handleLogin={handleLogin} handleLogout={handleLogout} userData={userData} />} />
          <Route path="/perfil" element={<ProfileView user={user} userData={userData} courses={courses} handleLogout={handleLogout} />} />
          <Route path="/curso/:courseId" element={<CourseDetailView courses={courses} user={user} handleLogin={handleLogin} handlePayment={initiatePayment} handleLogout={handleLogout} userData={userData} openRefundModal={() => setShowRefundModal(true)} />} />
          <Route path="/herramienta/:toolId" element={<ToolDetailView user={user} handleLogin={handleLogin} handleLogout={handleLogout} userData={userData} />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>

        {/* --- MODAL DE PAGOS (INTERFAZ RESTAURADA) --- */}
        {showPaymentModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#102A43]/80 backdrop-blur-sm animate-fade-in-up">
              <div className={`${COLORS.bgCard} rounded-[2rem] shadow-2xl max-w-md w-full p-8 text-center relative border border-[#627D98] animate-pop-in max-h-[90vh] overflow-y-auto`}>
                
                {/* CABECERA */}
                <h3 className={`text-2xl font-black mb-2 ${COLORS.textLight}`}>
                    {isSubscriptionPayment ? "Suscripción Premium" : "Desbloquear Curso"}
                </h3>
                <p className={`${COLORS.textMuted} mb-6 text-sm`}>
                    {isSubscriptionPayment 
                        ? "Accede a todo el contenido por un pago mensual." 
                        : `Estás comprando: "${courseToBuy?.title}"`
                    }
                </p>

                {/* PRECIO */}
                <div className="mb-6">
                    <span className={`text-4xl font-black ${COLORS.textLight}`}>
                        {formatCurrency(COURSE_PRICE)}
                    </span>
                    <span className={`${COLORS.textMuted} text-sm font-bold ml-2`}>
                        {isSubscriptionPayment ? "/mes" : "único"}
                    </span>
                </div>

                {/* TABS DE SELECCIÓN (BOTONES PARA CAMBIAR DE MÉTODO) */}
                <div className="flex bg-[#1F364D] p-1 rounded-full mb-6">
                    <button 
                        onClick={() => { setPaymentMethod('mercadopago'); setPreferenceId(null); }}
                        className={`flex-1 py-2 rounded-full text-sm font-bold transition-all ${paymentMethod === 'mercadopago' ? 'bg-[#F9703E] text-white shadow-md' : 'text-[#829AB1] hover:text-white'}`}
                    >
                        Tarjeta / Yape
                    </button>
                    <button 
                        onClick={() => { setPaymentMethod('paypal'); setPreferenceId(null); }}
                        className={`flex-1 py-2 rounded-full text-sm font-bold transition-all ${paymentMethod === 'paypal' ? 'bg-[#0070BA] text-white shadow-md' : 'text-[#829AB1] hover:text-white'}`}
                    >
                        PayPal
                    </button>
                </div>

                {/* CONTENIDO DEL MÉTODO DE PAGO */}
                <div className="min-h-[150px] flex flex-col justify-center w-full">
                    
                    {/* OPCIÓN 1: MERCADO PAGO */}
                    {paymentMethod === 'mercadopago' && (
                        <>
                            {isSubscriptionPayment ? (
                                <Button onClick={createPreference} variant="primary" className="w-full h-14 text-lg shadow-lg flex items-center justify-center gap-2">
                                    {isLoadingPayment ? <Loader className="animate-spin"/> : <> Suscribirse con Mercado Pago</>}
                                </Button>
                            ) : (
                                !preferenceId ? (
                                    <Button onClick={createPreference} variant="primary" className="w-full h-14 text-lg shadow-lg flex items-center justify-center gap-2">
                                        {isLoadingPayment ? <Loader className="animate-spin"/> : <>Pagar con Mercado Pago</>}
                                    </Button>
                                ) : (
                                    <div className="animate-fade-in-up w-full">
                                        <Wallet initialization={{ preferenceId }} customization={{ texts:{ valueProp: 'smart_option'}}} />
                                    </div>
                                )
                            )}
                        </>
                    )}

                    {/* OPCIÓN 2: PAYPAL */}
                    {paymentMethod === 'paypal' && (
                      <div className="animate-fade-in-up z-10 relative w-full">
                        <PayPalButtons 
                            key={isSubscriptionPayment ? "sub" : "pay"} 
                            style={{ layout: "vertical", shape: "rect", color: "blue", label: isSubscriptionPayment ? "subscribe" : "pay" }} 
                            createSubscription={isSubscriptionPayment ? (data, actions) => actions.subscription.create({ 'plan_id': PAYPAL_PLAN_ID }) : undefined}
                            createOrder={!isSubscriptionPayment ? (data, actions) => {
                                return actions.order.create({
                                    purchase_units: [{
                                        amount: {
                                            value: COURSE_PRICE.toFixed(2), 
                                            currency_code: "USD"
                                        },
                                        description: courseToBuy?.title || "Curso WebEric"
                                    }]
                                });
                            } : undefined}
                            onApprove={handlePayPalApprove}
                            onError={(err) => {
                                console.error("Error PayPal:", err);
                                showNotification("Error conectando con PayPal", "error");
                            }}
                        />
                      </div>
                    )}
                </div>

                <button onClick={() => setShowPaymentModal(false)} className={`w-full mt-6 text-sm font-bold ${COLORS.textMuted} hover:text-white transition-colors`}>Cancelar y volver</button>
              </div>
            </div>
        )}

        <LegalModal type={legalModalType} onClose={() => setLegalModalType(null)} />
        {showSplash && <SplashScreen finishAnimation={finishSplashAnimation} />}
        
        <NewsBubble news={liveNews} />

      </div>
    </PayPalScriptProvider>
  );
}