// src/App.jsx
import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation, useNavigate, Navigate } from 'react-router-dom';
import { CheckCircle, Loader, CreditCard, Globe, Bell, AlertTriangle, Calendar, Star } from 'lucide-react';

// FIREBASE IMPORTS 
import { db, auth, googleProvider } from './firebase'; 
import { doc, setDoc, updateDoc, onSnapshot, getDocs, collection } from 'firebase/firestore'; 
import { signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';

// MERCADO PAGO IMPORT
import { initMercadoPago, Wallet } from '@mercadopago/sdk-react';

// PAYPAL IMPORT
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

// --- DATOS & COMPONENTES --- 
import { ALL_COURSES } from './content/courses_data'; 
import { ALL_NEWS as STATIC_NEWS } from './content/news_data'; 
import { COLORS, PLAN_MONTHLY_PRICE, PLAN_YEARLY_PRICE, formatCurrency } from './utils/constants'; 
import { Button } from './components/UI';
import NeuralBackground from './components/NeuralBackground';
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

// URLs DEL BACKEND
const VERIFY_PAYPAL_URL = "https://us-central1-weberic-25da5.cloudfunctions.net/verifyPayPalEndpoint";

// --- IDs DE PLANES DE PAYPAL ---
// ID Mensual (Asegúrate que este también sea el correcto de tu panel, o usa el que tenías)
const PAYPAL_PLAN_MONTHLY_ID = "P-5X729325VU782483PNFDX2WY"; 

// ID Anual (EL QUE ACABAS DE DARME)
const PAYPAL_PLAN_YEARLY_ID = "P-04Y821593A494293XNFJVYAA"; 

// URL RSS NOTICIAS
const RSS_URL = "https://news.google.com/rss/search?q=inteligencia+artificial+tecnologia&hl=es-419&gl=PE&ceid=PE:es-419";
const API_URL = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(RSS_URL)}`;

if (MP_PUBLIC_KEY) initMercadoPago(MP_PUBLIC_KEY, { locale: 'es-PE' });

// Scroll to top
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
};

// Función helper para dominios de noticias
const getSmartDomain = (sourceName) => {
    const lower = sourceName.toLowerCase().replace(/\s+/g, '');
    if (lower.includes('comercio')) return 'elcomercio.pe';
    if (lower.includes('republica')) return 'larepublica.pe';
    return lower.normalize("NFD").replace(/[\u0300-\u036f]/g, "") + ".com";
};

export default function App() {
  const navigate = useNavigate(); 
  const [showSplash, setShowSplash] = useState(true);
  const [finishSplashAnimation, setFinishSplashAnimation] = useState(false);
  
  // ESTADOS DE PAGO Y SUSCRIPCIÓN
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('mercadopago');
  
  // Estado para saber qué plan eligió el usuario ('monthly' o 'yearly')
  const [selectedPlanType, setSelectedPlanType] = useState('monthly'); 

  const [notification, setNotification] = useState(null);
  const [isLoadingPayment, setIsLoadingPayment] = useState(false);
  const [preferenceId, setPreferenceId] = useState(null); 

  const [courses, setCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState(""); 
  const [loadingCourses, setLoadingCourses] = useState(true);
  const [user, setUser] = useState(null); 
  const [userData, setUserData] = useState({ purchasedCourses: [], isSubscribed: false });
  const [liveNews, setLiveNews] = useState(STATIC_NEWS); 
  const [legalModalType, setLegalModalType] = useState(null); 

  // SPLASH
  useEffect(() => {
    const timerExit = setTimeout(() => { setFinishSplashAnimation(true); }, 2500);
    const timerRemove = setTimeout(() => { setShowSplash(false); }, 3000);
    return () => { clearTimeout(timerExit); clearTimeout(timerRemove); };
  }, []);

  // DETECTOR DE PAGOS MP (Suscripción)
  useEffect(() => {
    const checkPaymentStatus = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const preapproval_id = urlParams.get('preapproval_id'); // ID de suscripción MP
      
      if (user && preapproval_id) {
        try {
            const userRef = doc(db, "users", user.uid);
            await updateDoc(userRef, { 
                isSubscribed: true,
                subscriptionSource: 'mercadopago_frontend',
                subscriptionId: preapproval_id,
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
    };
    if (!loadingCourses && user) checkPaymentStatus();
  }, [user, loadingCourses]); 

  // CARGAR DATA (Cursos, Noticias, Auth)
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

  // --- LÓGICA DE SUSCRIPCIÓN ---
  const initiateSubscription = (planType = 'monthly') => {
    if (!user) { showNotification("Inicia sesión para suscribirte", "error"); handleLogin(); return; }
    setSelectedPlanType(planType); 
    setPreferenceId(null);
    setPaymentMethod('mercadopago');
    setShowPaymentModal(true);
  };

  const createPreference = async () => {
    setIsLoadingPayment(true);

    try {
        // Enviar al backend qué plan queremos ('monthly' o 'yearly')
        const response = await fetch("https://us-central1-weberic-25da5.cloudfunctions.net/api/payment/create-subscription", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
                userId: user.uid,     
                email: user.email,
                planType: selectedPlanType 
            }),
        });

        const data = await response.json();

        if (data.init_point) {
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
                isSubscription: true,
                planType: selectedPlanType 
            })
        });

        const result = await response.json();

        if (result.success) {
            showNotification("¡Suscripción exitosa!", "success");
            setShowPaymentModal(false);
        } else {
            showNotification("El pago no pudo ser verificado.", "error");
        }
    } catch (err) { 
        console.error(err);
        showNotification("Error de comunicación.", "error"); 
    } finally {
        setIsLoadingPayment(false);
    }
  };

  // Determinar ID de Plan de PayPal según selección
  const currentPayPalPlanId = selectedPlanType === 'yearly' ? PAYPAL_PLAN_YEARLY_ID : PAYPAL_PLAN_MONTHLY_ID;

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
          <Route path="/curso/:courseId" element={<CourseDetailView courses={courses} user={user} handleLogin={handleLogin} handlePayment={() => initiateSubscription('monthly')} handleLogout={handleLogout} userData={userData} openRefundModal={() => setShowRefundModal(true)} />} />
          <Route path="/herramienta/:toolId" element={<ToolDetailView user={user} handleLogin={handleLogin} handleLogout={handleLogout} userData={userData} />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>

        {/* MODAL DE SUSCRIPCIÓN UNIFICADO */}
        {showPaymentModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#102A43]/90 backdrop-blur-md animate-fade-in-up">
            <div className={`${COLORS.bgCard} rounded-[2rem] shadow-2xl max-w-md w-full p-8 text-center relative border border-[#627D98] animate-pop-in max-h-[90vh] overflow-y-auto`}>
              
              <h3 className={`text-2xl font-black mb-2 ${COLORS.textLight}`}>
                Elige tu Plan Premium
              </h3>
              <p className="text-[#829AB1] text-xs mb-6 font-medium">
                Acceso ilimitado a todos los cursos y actualizaciones
              </p>

              {/* SELECTOR DE PLANES */}
              <div className="grid grid-cols-2 gap-4 mb-8">
                 <button
                    onClick={() => { setSelectedPlanType('monthly'); setPreferenceId(null); }}
                    className={`p-4 rounded-2xl border-2 transition-all duration-300 flex flex-col items-center justify-center gap-1 ${
                        selectedPlanType === 'monthly'
                        ? 'border-[#F9703E] bg-[#F9703E]/10 shadow-[0_0_15px_rgba(249,112,62,0.3)] transform scale-105'
                        : 'border-[#486581] hover:bg-[#334E68] opacity-70'
                    }`}
                 >
                    <span className="text-xs text-[#BCCCDC] uppercase font-bold">Mensual</span>
                    <span className="text-xl font-black text-white">{formatCurrency(PLAN_MONTHLY_PRICE)}</span>
                 </button>

                 <button
                    onClick={() => { setSelectedPlanType('yearly'); setPreferenceId(null); }}
                    className={`p-4 rounded-2xl border-2 transition-all duration-300 flex flex-col items-center justify-center gap-1 relative ${
                        selectedPlanType === 'yearly'
                        ? 'border-[#F9703E] bg-[#F9703E]/10 shadow-[0_0_15px_rgba(249,112,62,0.3)] transform scale-105'
                        : 'border-[#486581] hover:bg-[#334E68] opacity-70'
                    }`}
                 >
                    <div className="absolute -top-3 bg-[#48BB78] text-white text-[9px] font-bold px-2 py-0.5 rounded-full shadow-sm">
                        AHORRA 16%
                    </div>
                    <span className="text-xs text-[#BCCCDC] uppercase font-bold">Anual</span>
                    <span className="text-xl font-black text-white">{formatCurrency(PLAN_YEARLY_PRICE)}</span>
                 </button>
              </div>

              {/* SELECTOR DE MÉTODO DE PAGO */}
              <div className="flex gap-4 mb-6 justify-center">
                <button
                  onClick={() => { setPaymentMethod('mercadopago'); setPreferenceId(null); }}
                  className={`py-2 px-4 rounded-xl border transition-all text-xs font-bold flex items-center gap-2 ${
                    paymentMethod === 'mercadopago' 
                      ? 'border-[#009EE3] text-[#009EE3] bg-[#009EE3]/10' 
                      : 'border-[#486581] text-[#829AB1]'
                  }`}
                >
                  <CreditCard size={16} /> Mercado Pago (S/.)
                </button>

                <button
                  onClick={() => { setPaymentMethod('paypal'); setPreferenceId(null); }}
                  className={`py-2 px-4 rounded-xl border transition-all text-xs font-bold flex items-center gap-2 ${
                    paymentMethod === 'paypal' 
                      ? 'border-[#FFC439] text-[#FFC439] bg-[#FFC439]/10' 
                      : 'border-[#486581] text-[#829AB1]'
                  }`}
                >
                  <span className="font-serif italic font-black">P</span> PayPal ($)
                </button>
              </div>

              {/* ÁREA DE ACCIÓN DE PAGO */}
              <div className="min-h-[100px] flex flex-col justify-center">
                {paymentMethod === 'mercadopago' ? (
                    <div className="animate-fade-in">
                      <Button onClick={createPreference} variant="primary" className="w-full h-12 text-base shadow-lg bg-[#009EE3] hover:bg-[#007eb5] border-none text-white font-bold">
                        {isLoadingPayment ? <Loader className="animate-spin mx-auto"/> : `Suscribirse ${selectedPlanType === 'monthly' ? 'Mensual' : 'Anual'}`}
                      </Button>
                      <p className="text-[10px] text-[#829AB1] mt-3">
                        Se cobrará en Soles peruanos automáticamente.
                      </p>
                    </div>
                ) : (
                  <div className="animate-fade-in w-full relative z-10">
                    <PayPalButtons 
                        key={`${selectedPlanType}-paypal`} 
                        style={{ layout: "vertical", shape: "rect", color: "gold", label: "subscribe", height: 45 }} 
                        createSubscription={(data, actions) => {
                            return actions.subscription.create({
                                'plan_id': currentPayPalPlanId 
                            });
                        }}
                        onApprove={handlePayPalApprove}
                    />
                    <p className="text-[10px] text-[#829AB1] mt-2">
                        Pago internacional seguro en Dólares.
                    </p>
                  </div>
                )}
              </div>

              <button onClick={() => setShowPaymentModal(false)} className={`w-full mt-6 text-xs font-bold ${COLORS.textMuted} hover:text-white transition-colors underline`}>
                Cancelar
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