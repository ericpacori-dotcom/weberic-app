// src/App.jsx
import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation, useNavigate, Navigate } from 'react-router-dom';
import { CheckCircle, Loader, CreditCard, Globe, Bell, AlertTriangle } from 'lucide-react';

// FIREBASE IMPORTS 
import { db, auth, googleProvider } from './firebase';
import { 
  collection, getDocs, doc, setDoc, updateDoc, onSnapshot 
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

// --- VISTAS ---
import HomeView from './views/HomeView';
import SubscriptionView from './views/SubscriptionView';
import CourseDetailView from './views/CourseDetailView';
import ProfileView from './views/ProfileView';
import NewsView from './views/NewsView'; 
import ToolDetailView from './views/ToolDetailView';

// ==========================================
// ⚙️ CONFIGURACIÓN GLOBAL DE PAGOS
// ==========================================

const MP_PUBLIC_KEY = import.meta.env.VITE_MP_PUBLIC_KEY; 
const PAYPAL_CLIENT_ID = import.meta.env.VITE_PAYPAL_CLIENT_ID; 
const BACKEND_URL = "https://us-central1-weberic-25da5.cloudfunctions.net/createOrder"; 

// 🔴 CONFIGURACIÓN DE SUSCRIPCIONES
const PAYPAL_PLAN_ID = "P-5X729325VU782483PNFDX2WY"; 
const MP_SUBSCRIPTION_PLAN_ID = "3bac21d11f4047be91016c280dc0bb33"; 

// URL RSS NOTICIAS
const RSS_URL = "https://news.google.com/rss/search?q=inteligencia+artificial+tecnologia&hl=es-419&gl=PE&ceid=PE:es-419";
const API_URL = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(RSS_URL)}`;

initMercadoPago(MP_PUBLIC_KEY, { locale: 'es-PE' });

// COMPONENTE PARA MANEJAR SCROLL AL CAMBIAR DE RUTA
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

export default function App() {
  const navigate = useNavigate(); // Hook para navegar
  const [showSplash, setShowSplash] = useState(true);
  const [finishSplashAnimation, setFinishSplashAnimation] = useState(false);
  
  // ESTADOS GLOBALES
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [isSubscriptionPayment, setIsSubscriptionPayment] = useState(false); 
  const [paymentMethod, setPaymentMethod] = useState('mercadopago');
  const [courseToBuy, setCourseToBuy] = useState(null); // Curso seleccionado para pagar
  
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

  // --- NOTICIAS ---
  const [newsIndex, setNewsIndex] = useState(0);
  const [showNewsTicker, setShowNewsTicker] = useState(false);
  const [liveNews, setLiveNews] = useState(STATIC_NEWS); 

  // --- SPLASH ---
  useEffect(() => {
    const timerExit = setTimeout(() => { setFinishSplashAnimation(true); }, 2500);
    const timerRemove = setTimeout(() => { setShowSplash(false); }, 3000);
    return () => { clearTimeout(timerExit); clearTimeout(timerRemove); };
  }, []);

  // --- 🔒 SEGURIDAD: DETECTOR DE PAGOS ---
  useEffect(() => {
    const checkPaymentStatus = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const status = urlParams.get('status');
      
      if (status === 'approved' && user) {
        if (urlParams.has('preapproval_id') || isSubscriptionPayment) {
            showNotification("¡Suscripción Recibida! Activando tu cuenta...", "success");
        } else {
            showNotification("¡Pago Exitoso! Tu curso se desbloqueará en breve.", "success");
        }
        window.history.replaceState({}, document.title, window.location.pathname);
        setShowPaymentModal(false);
      }
    };
    if (!loadingCourses && user) {
        checkPaymentStatus();
    }
  }, [user, loadingCourses]); 

  // --- CARGAR NOTICIAS ---
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
            let domainGuess = sourceName.toLowerCase().replace(/\s+/g, '').replace(/[áéíóúñ]/g, (c) => "aeioun"["áéíóúñ".indexOf(c)]);
            if (domainGuess.includes("comercio")) domainGuess = "elcomercio.pe";
            else if (domainGuess.includes("larepublica")) domainGuess = "larepublica.pe";
            else if (domainGuess.includes("rpp")) domainGuess = "rpp.pe";
            else if (domainGuess.includes("xataka")) domainGuess = "xataka.com";
            else if (domainGuess.includes("genbeta")) domainGuess = "genbeta.com";
            else domainGuess += ".com";
            const logoUrl = `https://www.google.com/s2/favicons?domain=${domainGuess}&sz=128`;
            return {
              id: index,
              title: cleanTitle,
              source: sourceName,
              category: "IA News",
              date: item.pubDate.split(' ')[0],
              description: "Noticia destacada. Toca para leer más.",
              link: item.link,
              image: logoUrl 
            };
          });
          setLiveNews(formattedNews);
        }
      } catch (error) { console.error("Error cargando noticias:", error); }
    };
    fetchNews();
  }, []);

  // --- CICLO NOTICIAS ---
  useEffect(() => {
    const cycleNews = () => {
      setShowNewsTicker(true);
      setTimeout(() => {
        setShowNewsTicker(false);
        setTimeout(() => setNewsIndex(prev => (prev + 1) % liveNews.length), 500); 
      }, 8000); 
    };
    const initialTimer = setTimeout(cycleNews, 2000); 
    const interval = setInterval(cycleNews, 20000); 
    return () => { clearTimeout(initialTimer); clearInterval(interval); };
  }, [liveNews]); 

  // --- CARGA DATOS ---
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "courses"));
        const coursesData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        // Si no hay cursos en BD (primera vez), usamos los locales
        setCourses(coursesData.length > 0 ? coursesData : ALL_COURSES);
        setLoadingCourses(false);
      } catch (error) { 
        console.error(error); 
        setCourses(ALL_COURSES); // Fallback a datos locales
        setLoadingCourses(false); 
      }
    };
    fetchCourses();
  }, []);

  // --- 🔒 SEGURIDAD: GESTIÓN DE USUARIO EN TIEMPO REAL ---
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (!currentUser) {
         setUserData({ purchasedCourses: [], isSubscribed: false });
      }
    });
    return () => unsubscribeAuth();
  }, []);

  useEffect(() => {
    if (user) {
        const userDocRef = doc(db, "users", user.uid);
        const unsubscribeSnapshot = onSnapshot(userDocRef, (docSnap) => {
            if (docSnap.exists()) {
                setUserData(docSnap.data());
            } else {
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

  // --- INICIAR PROCESO DE PAGO (Llamado desde CourseDetailView) ---
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

  // --- LÓGICA DE CREACIÓN DE PREFERENCIA (BACKEND) ---
  const createPreference = async () => {
    setIsLoadingPayment(true);
    
    if (isSubscriptionPayment) {
        setTimeout(() => {
             window.location.href = `https://www.mercadopago.com.pe/subscriptions/checkout?preapproval_plan_id=${MP_SUBSCRIPTION_PLAN_ID}`;
        }, 1500);
        return; 
    }

    try {
      const response = await fetch(BACKEND_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          id: courseToBuy.id, 
          title: courseToBuy.title, 
          price: COURSE_PRICE, 
          userId: user.uid 
        }), 
      });
      const data = await response.json();
      setPreferenceId(data.id); 
    } catch (error) { showNotification("Error conexión", "error"); } 
    finally { setIsLoadingPayment(false); }
  };

  // NOTA: PayPal sigue usando escritura en frontend por ahora.
  const handlePayPalApprove = async (data, actions) => {
    try {
      const userRef = doc(db, "users", user.uid);
      if (isSubscriptionPayment) { 
          await updateDoc(userRef, { 
              isSubscribed: true,
              subscriptionStartDate: new Date().toISOString(),
              subscriptionProvider: 'paypal',
              subscriptionId: data.subscriptionID 
          }); 
      } 
      else { 
          await updateDoc(userRef, { purchasedCourses: arrayUnion(courseToBuy.id) }); 
      }
      showNotification("¡Pago Exitoso con PayPal!", "success");
      setShowPaymentModal(false);
    } catch (err) { showNotification("Error guardando compra", "error"); }
  };

  return (
    <PayPalScriptProvider options={{ 
        "client-id": PAYPAL_CLIENT_ID, 
        currency: "USD",
        intent: "subscription", 
        vault: true 
    }}>
      <div className={`font-sans ${COLORS.textLight} ${COLORS.bgMain} min-h-screen relative animate-fade-in`}>
        <ScrollToTop />
        <NeuralBackground />

        {notification && (
          <div className={`fixed top-8 left-1/2 transform -translate-x-1/2 z-[100] px-8 py-4 rounded-full shadow-2xl flex items-center gap-4 animate-pop-in ${COLORS.bgCard} border border-[#627D98] ${notification.type === 'error' ? 'text-red-400' : COLORS.textOrange} text-base font-bold`}>
            <CheckCircle size={24} /> {notification.msg}
          </div>
        )}
        
        {/* SISTEMA DE RUTAS */}
        <Routes>
          <Route path="/" element={
            <HomeView 
              courses={courses} loadingCourses={loadingCourses} userData={userData} user={user} 
              searchTerm={searchTerm} setSearchTerm={setSearchTerm} 
              handleLogin={handleLogin} handleLogout={handleLogout} 
              openLegalModal={setLegalModalType} 
              // Nota: Ya no pasamos setView, HomeView usará Link o useNavigate
            />
          } />
          
          <Route path="/noticias" element={
            <NewsView user={user} userData={userData} handleLogin={handleLogin} handleLogout={handleLogout} news={liveNews} />
          } />

          <Route path="/suscripcion" element={
            <SubscriptionView onSubscribe={initiateSubscription} isSubscribed={userData?.isSubscribed} user={user} handleLogin={handleLogin} handleLogout={handleLogout} userData={userData} />
          } />

          <Route path="/perfil" element={
            <ProfileView user={user} userData={userData} courses={courses} handleLogout={handleLogout} />
          } />

          <Route path="/curso/:courseId" element={
            <CourseDetailView 
              courses={courses} // Pasamos TODOS los cursos, el componente buscará el ID
              user={user} 
              handleLogin={handleLogin} 
              handlePayment={initiatePayment} 
              handleLogout={handleLogout} 
              userData={userData} 
              openRefundModal={() => setShowRefundModal(true)} 
            />
          } />

          <Route path="/herramienta/:toolId" element={
            <ToolDetailView user={user} handleLogin={handleLogin} handleLogout={handleLogout} userData={userData} />
          } />
          
          {/* Ruta 404 - Redirigir a Home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>

        {showPaymentModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#102A43]/80 backdrop-blur-sm animate-fade-in-up">
              <div className={`${COLORS.bgCard} rounded-[2rem] shadow-2xl max-w-md w-full p-8 text-center relative border border-[#627D98] animate-pop-in max-h-[90vh] overflow-y-auto`}>
                <div className={`absolute top-0 left-0 w-full h-2 ${COLORS.accentOrange}`}></div>
                <h3 className={`text-3xl font-black mb-2 ${COLORS.textLight} leading-tight`}>{isSubscriptionPayment ? "Pase Premium Mensual" : "Desbloquea tu Potencial"}</h3>
                
                <div className={`${COLORS.bgMain} p-4 rounded-2xl mb-4 border border-[#486581]`}>
                  <p className={`text-[10px] ${COLORS.textOrange} font-bold uppercase tracking-widest mb-1`}>{isSubscriptionPayment ? "Precio Mensual" : "Total a Pagar"}</p>
                  <p className={`text-4xl font-black ${COLORS.textLight}`}>{formatCurrency(COURSE_PRICE)}</p>
                  <p className="text-[10px] text-[#BCCCDC] mt-1">Pagos procesados en Dólares (USD)</p>
                </div>

                <div className="bg-[#102A43] p-3 rounded-xl mb-4 border border-[#F9703E]/30">
                   <p className="text-[11px] text-[#BCCCDC] leading-tight">
                     💡 <b>Consejo de Pago:</b><br/>
                     🇵🇪 <b>Perú / Latam:</b> Usa <span className="text-white font-bold">Tarjeta</span> (Recomendado).<br/>
                     🌎 <b>Internacional:</b> Usa <span className="text-white font-bold">PayPal</span>.
                   </p>
                </div>

                <div className="bg-yellow-500/10 border border-yellow-500/30 p-3 rounded-xl mb-6 flex items-start gap-2">
                    <AlertTriangle size={16} className="text-yellow-400 flex-shrink-0 mt-0.5" />
                    <p className="text-[10px] text-yellow-200/90 leading-tight text-left">
                       <b>¡IMPORTANTE!</b> Al finalizar tu pago, asegúrate de hacer clic en <b>"Volver al sitio"</b> para activar tu cuenta automáticamente.
                    </p>
                </div>

                <div className="flex gap-2 mb-6 bg-[#334E68] p-1 rounded-xl">
                  <button onClick={() => setPaymentMethod('mercadopago')} className={`flex-1 py-2 rounded-lg font-bold text-xs flex items-center justify-center gap-2 transition-all ${paymentMethod === 'mercadopago' ? 'bg-[#486581] text-white shadow-sm' : 'text-[#BCCCDC] hover:text-white'}`}><CreditCard size={14} /> Tarjeta / Yape</button>
                  <button onClick={() => setPaymentMethod('paypal')} className={`flex-1 py-2 rounded-lg font-bold text-xs flex items-center justify-center gap-2 transition-all ${paymentMethod === 'paypal' ? 'bg-[#003087] text-white shadow-sm' : 'text-[#BCCCDC] hover:text-white'}`}><Globe size={14} /> PayPal</button>
                </div>
                
                {paymentMethod === 'mercadopago' ? (
                    isSubscriptionPayment ? (
                        <Button onClick={createPreference} variant="primary" className="w-full h-14 text-lg shadow-lg">
                            {isLoadingPayment ? <><Loader className="animate-spin mx-auto mr-2 inline" size={18}/> Redirigiendo...</> : "Suscribirse con Mercado Pago"}
                        </Button>
                    ) : (
                        !preferenceId ? (
                            <Button onClick={createPreference} variant="primary" className="w-full h-14 text-lg shadow-lg">
                                {isLoadingPayment ? <Loader className="animate-spin mx-auto"/> : "Pagar Curso Único"}
                            </Button>
                        ) : (
                            <div className="animate-fade-in-up"><Wallet initialization={{ preferenceId }} customization={{ texts:{ valueProp: 'smart_option'}}} /></div>
                        )
                    )
                ) : (
                  <div className="animate-fade-in-up z-10 relative">
                    <PayPalButtons 
                        style={{ layout: "vertical", shape: "pill" }} 
                        createSubscription={isSubscriptionPayment ? (data, actions) => {
                            return actions.subscription.create({
                                'plan_id': PAYPAL_PLAN_ID,
                                'application_context': { 'shipping_preference': 'NO_SHIPPING' }
                            });
                        } : undefined}
                        createOrder={!isSubscriptionPayment ? (data, actions) => {
                            return actions.order.create({ 
                                purchase_units: [{ 
                                  amount: { value: COURSE_PRICE.toString() }, 
                                  description: courseToBuy.title,
                                  category: "DIGITAL_GOODS" 
                                }],
                                application_context: {
                                  shipping_preference: 'NO_SHIPPING', 
                                  brand_name: "Haeric Academy",
                                  user_action: "PAY_NOW"
                                }
                            });
                        } : undefined}
                        onApprove={handlePayPalApprove}
                        onError={(err) => {
                          console.error("PayPal Error:", err);
                          showNotification("Error en PayPal. Intenta con Tarjeta.", "error");
                        }} 
                    />
                  </div>
                )}
                
                <button onClick={() => setShowPaymentModal(false)} className={`w-full mt-6 text-sm font-bold ${COLORS.textMuted} hover:text-white transition-colors uppercase tracking-wider`}>Cancelar</button>
              </div>
            </div>
        )}

        <LegalModal type={legalModalType} onClose={() => setLegalModalType(null)} />
        {showSplash && <SplashScreen finishAnimation={finishSplashAnimation} />}
      </div>
    </PayPalScriptProvider>
  );
}