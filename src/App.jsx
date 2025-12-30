// src/App.jsx
import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation, useNavigate, Navigate } from 'react-router-dom';
import { CheckCircle, Loader, CreditCard, Globe, Bell, AlertTriangle } from 'lucide-react';

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
import { Button } from './components/UI';
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

// --- CONFIGURACIÓN DE SEGURIDAD Y PAGOS ---
const MP_PUBLIC_KEY = import.meta.env.VITE_MP_PUBLIC_KEY; 
const PAYPAL_CLIENT_ID = import.meta.env.VITE_PAYPAL_CLIENT_ID; 

// URLs DEL BACKEND (CLOUD FUNCTIONS)
const CREATE_ORDER_URL = "https://us-central1-weberic-25da5.cloudfunctions.net/createOrder"; 
const VERIFY_PAYPAL_URL = "https://us-central1-weberic-25da5.cloudfunctions.net/verifyPayPalEndpoint";

const PAYPAL_PLAN_ID = "P-5X729325VU782483PNFDX2WY"; 
const MP_SUBSCRIPTION_PLAN_ID = "3bac21d11f4047be91016c280dc0bb33"; 

// URL RSS NOTICIAS
const RSS_URL = "https://news.google.com/rss/search?q=inteligencia+artificial+tecnologia&hl=es-419&gl=PE&ceid=PE:es-419";
const API_URL = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(RSS_URL)}`;

// Inicializar Mercado Pago (CORREGIDO: Ya acepta claves APP_USR de producción)
if (MP_PUBLIC_KEY) {
  initMercadoPago(MP_PUBLIC_KEY, { locale: 'es-PE' });
} else {
  console.warn("⚠️ Falta VITE_MP_PUBLIC_KEY en .env");
}

// Scroll to top
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
};

// --- FUNCIÓN DE LOGOS INTELIGENTE ---
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
  
  // ESTADOS GLOBALES
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [isSubscriptionPayment, setIsSubscriptionPayment] = useState(false); 
  const [paymentMethod, setPaymentMethod] = useState('mercadopago');
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

  // ESTADO DE NOTICIAS
  const [liveNews, setLiveNews] = useState(STATIC_NEWS); 

  // SPLASH
  useEffect(() => {
    const timerExit = setTimeout(() => { setFinishSplashAnimation(true); }, 2500);
    const timerRemove = setTimeout(() => { setShowSplash(false); }, 3000);
    return () => { clearTimeout(timerExit); clearTimeout(timerRemove); };
  }, []);

  // DETECTOR DE PAGOS
  useEffect(() => {
    const checkPaymentStatus = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const status = urlParams.get('status');
      const preapproval_id = urlParams.get('preapproval_id'); 
      
      if (user) {
        if (preapproval_id) {
            try {
                const userRef = doc(db, "users", user.uid);
                await updateDoc(userRef, { 
                    isSubscribed: true,
                    subscriptionSource: 'mercadopago_frontend',
                    subscriptionDate: new Date().toISOString()
                });
                showNotification("¡Suscripción Premium Activada!", "success");
                window.history.replaceState({}, document.title, window.location.pathname);
                setShowPaymentModal(false);
            } catch (error) {
                console.error("Error activando sub:", error);
                showNotification("Contacta a soporte para activar tu cuenta.", "error");
            }
        }
        else if (status === 'approved') {
            showNotification("Pago recibido. Tu curso se desbloqueará en unos segundos.", "success");
            window.history.replaceState({}, document.title, window.location.pathname);
            setShowPaymentModal(false);
        }
      }
    };
    if (!loadingCourses && user) checkPaymentStatus();
  }, [user, loadingCourses]); 

  // CARGAR NOTICIAS
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
              description: "Noticia destacada. Toca para leer más en la fuente original.",
              link: item.link,
              image: `https://www.google.com/s2/favicons?domain=${realDomain}&sz=128`
            };
          });
          setLiveNews(formattedNews); 
        }
      } catch (error) { console.error("Error cargando noticias:", error); }
    };
    fetchNews();
  }, []);

  // CARGAR CURSOS
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

  // PAGOS
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

  const createPreference = async () => {
    setIsLoadingPayment(true);

    // --- LÓGICA DE SUSCRIPCIÓN (MODIFICADA) ---
    if (isSubscriptionPayment) {
        try {
            // Usamos tu URL de producción de Firebase (basada en tu ID de proyecto: weberic-25da5)
            const response = await fetch("https://us-central1-weberic-25da5.cloudfunctions.net/api/payment/create-subscription", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ 
                    userId: user.uid,     // Enviamos ID para vincular la renovación
                    email: user.email 
                }),
            });

            const data = await response.json();

            if (data.init_point) {
                // Redirigimos al usuario al link ÚNICO generado por tu backend
                window.location.href = data.init_point; 
            } else {
                console.error("Error del backend:", data);
                showNotification("No se pudo generar el link de suscripción.", "error");
                setIsLoadingPayment(false);
            }
        } catch (error) {
            console.error("Error de conexión:", error);
            showNotification("Error al conectar con el servidor de pagos.", "error");
            setIsLoadingPayment(false);
        }
        return; // Detenemos la ejecución aquí
    }

    // --- LÓGICA DE PAGO ÚNICO (ORIGINAL) ---
    try {
      const response = await fetch(CREATE_ORDER_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
            id: courseToBuy.id, 
            title: courseToBuy.title, 
            price: COURSE_PRICE, 
            userId: user.uid,
            email: user.email 
        }), 
      });
      const data = await response.json();
      if (data.id) setPreferenceId(data.id);
      else showNotification("Error creando orden MP", "error");
    } catch (error) { showNotification("Error de conexión", "error"); } 
    finally { setIsLoadingPayment(false); }
  };

  const handlePayPalApprove = async (data, actions) => {
    try {
        setIsLoadingPayment(true);
        const response = await fetch(VERIFY_PAYPAL_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                userId: user.uid,
                orderID: data.orderID,
                subscriptionID: data.subscriptionID,
                courseId: courseToBuy?.id,
                isSubscription: isSubscriptionPayment
            })
        });

        const result = await response.json();

        if (result.success) {
            showNotification("¡Pago verificado exitosamente!", "success");
            setShowPaymentModal(false);
        } else {
            console.error(result.error);
            showNotification("El pago no pudo ser verificado.", "error");
        }
    } catch (err) { 
        console.error(err);
        showNotification("Error de comunicación.", "error"); 
    } finally {
        setIsLoadingPayment(false);
    }
  };

  return (
    <PayPalScriptProvider options={{ "client-id": PAYPAL_CLIENT_ID, currency: "USD", intent: "subscription", vault: true }}>
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

        {showPaymentModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#102A43]/90 backdrop-blur-md animate-fade-in-up">
            <div className={`${COLORS.bgCard} rounded-[2rem] shadow-2xl max-w-md w-full p-8 text-center relative border border-[#627D98] animate-pop-in max-h-[90vh] overflow-y-auto`}>
              
              <h3 className={`text-2xl font-black mb-2 ${COLORS.textLight}`}>
                {isSubscriptionPayment ? "Elige tu Suscripción" : "Finalizar Compra"}
              </h3>
              <p className="text-[#829AB1] text-sm mb-6 font-medium">
                Selecciona tu método de pago preferido
              </p>

              <div className="flex gap-4 mb-8">
                <button
                  onClick={() => { setPaymentMethod('mercadopago'); setPreferenceId(null); }}
                  className={`flex-1 py-4 px-2 rounded-2xl border-2 transition-all duration-300 flex flex-col items-center justify-center gap-2 group ${
                    paymentMethod === 'mercadopago' 
                      ? 'border-[#009EE3] bg-[#009EE3]/10 shadow-[0_0_20px_rgba(0,158,227,0.3)]' 
                      : 'border-[#486581] hover:border-[#009EE3]/50 hover:bg-[#102A43]'
                  }`}
                >
                  <CreditCard size={28} className={paymentMethod === 'mercadopago' ? 'text-[#009EE3]' : 'text-[#829AB1]'} />
                  <div className="flex flex-col">
                    <span className={`font-bold text-sm ${paymentMethod === 'mercadopago' ? 'text-[#009EE3]' : 'text-[#829AB1]'}`}>Mercado Pago</span>
                    <span className="text-[10px] font-bold text-[#829AB1] opacity-80">Soles (S/.)</span>
                  </div>
                </button>

                <button
                  onClick={() => { setPaymentMethod('paypal'); setPreferenceId(null); }}
                  className={`flex-1 py-4 px-2 rounded-2xl border-2 transition-all duration-300 flex flex-col items-center justify-center gap-2 group ${
                    paymentMethod === 'paypal' 
                      ? 'border-[#FFC439] bg-[#FFC439]/10 shadow-[0_0_20px_rgba(255,196,57,0.2)]' 
                      : 'border-[#486581] hover:border-[#FFC439]/50 hover:bg-[#102A43]'
                  }`}
                >
                  <div className="flex items-center justify-center w-7 h-7 bg-white rounded-full font-black italic text-[#003087] text-xs">P</div>
                  <div className="flex flex-col">
                    <span className={`font-bold text-sm ${paymentMethod === 'paypal' ? 'text-[#FFC439]' : 'text-[#829AB1]'}`}>PayPal</span>
                    <span className="text-[10px] font-bold text-[#829AB1] opacity-80">Dólares ($)</span>
                  </div>
                </button>
              </div>

              <div className="min-h-[150px] flex flex-col justify-center">
                {paymentMethod === 'mercadopago' ? (
                  isSubscriptionPayment ? (
                    <div className="animate-fade-in">
                      <p className="text-sm text-[#829AB1] mb-4">Suscripción mensual automática en Soles.</p>
                      <Button onClick={createPreference} variant="primary" className="w-full h-14 text-lg shadow-lg bg-[#009EE3] hover:bg-[#007eb5] border-none text-white">
                        {isLoadingPayment ? <Loader className="animate-spin mx-auto"/> : "Suscribirse con Mercado Pago"}
                      </Button>
                    </div>
                  ) : (
                    !preferenceId ? (
                      <div className="animate-fade-in">
                        <p className="text-sm text-[#829AB1] mb-4">Pago único seguro en Soles.</p>
                        <Button onClick={createPreference} variant="primary" className="w-full h-14 text-lg shadow-lg bg-[#009EE3] hover:bg-[#007eb5] border-none text-white">
                          {isLoadingPayment ? <Loader className="animate-spin mx-auto"/> : `Pagar ${formatCurrency(COURSE_PRICE)}`}
                        </Button>
                      </div>
                    ) : (
                      <div className="animate-fade-in-up">
                        <Wallet initialization={{ preferenceId }} customization={{ texts:{ valueProp: 'smart_option'}}} />
                      </div>
                    )
                  )
                ) : (
                  <div className="animate-fade-in w-full relative z-10">
                    <p className="text-sm text-[#829AB1] mb-4">
                      {isSubscriptionPayment ? "Suscripción internacional en USD." : "Pago seguro internacional en USD."}
                    </p>
                    <PayPalButtons 
                        key={isSubscriptionPayment ? "sub-paypal" : "one-paypal"} 
                        style={{ layout: "vertical", shape: "rect", color: "gold", label: isSubscriptionPayment ? "subscribe" : "pay" }} 
                        createSubscription={isSubscriptionPayment ? (data, actions) => actions.subscription.create({ 'plan_id': PAYPAL_PLAN_ID }) : undefined}
                        createOrder={!isSubscriptionPayment ? (data, actions) => actions.order.create({ purchase_units: [{ amount: { value: COURSE_PRICE.toString() }, description: courseToBuy.title }] }) : undefined}
                        onApprove={handlePayPalApprove}
                    />
                  </div>
                )}
              </div>

              <button onClick={() => setShowPaymentModal(false)} className={`w-full mt-8 text-sm font-bold ${COLORS.textMuted} hover:text-white transition-colors`}>
                Cancelar y volver
              </button>
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