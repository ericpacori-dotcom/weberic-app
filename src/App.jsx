// src/App.jsx
import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation, useNavigate, Navigate } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';

// FIREBASE IMPORTS 
import { db, auth, googleProvider } from './firebase'; 
import { doc, setDoc, onSnapshot, getDocs, collection } from 'firebase/firestore'; 
import { signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';

// PAYPAL IMPORT
import { PayPalScriptProvider } from "@paypal/react-paypal-js";

// --- DATOS & COMPONENTES --- 
import { ALL_COURSES } from './content/courses_data'; 
import { ALL_NEWS as STATIC_NEWS } from './content/news_data'; 
import { COLORS } from './utils/constants'; 
import NeuralBackground from './components/NeuralBackground';
import LegalModal from './components/LegalModal';
import SplashScreen from './components/SplashScreen'; 
import NewsBubble from './components/NewsBubble';
import Footer from './components/Footer';

// --- VISTAS ---
import HomeView from './views/HomeView';
import SubscriptionView from './views/SubscriptionView';
import CourseDetailView from './views/CourseDetailView';
import ProfileView from './views/ProfileView';
import NewsView from './views/NewsView'; 
import ToolDetailView from './views/ToolDetailView';

const PAYPAL_CLIENT_ID = import.meta.env.VITE_PAYPAL_CLIENT_ID; 
const VERIFY_PAYPAL_URL = "https://us-central1-weberic-25da5.cloudfunctions.net/verifyPayPalEndpoint";

// URL RSS NOTICIAS
const RSS_URL = "https://news.google.com/rss/search?q=inteligencia+artificial+tecnologia&hl=es-419&gl=PE&ceid=PE:es-419";
const API_URL = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(RSS_URL)}`;

// Scroll to top
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
};

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
  const [notification, setNotification] = useState(null);
  
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

  // CARGAR DATA
  useEffect(() => { 
      const fetchCourses = async () => {
        try {
            const querySnapshot = await getDocs(collection(db, "courses"));
            const coursesData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setCourses(coursesData.length > 0 ? coursesData : ALL_COURSES);
            setLoadingCourses(false);
        } catch (error) { setCourses(ALL_COURSES); setLoadingCourses(false); }
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
            const realDomain = getSmartDomain(sourceName);
            return {
              id: index, title: titleParts.join(' - '), source: sourceName, category: "IA News",
              date: item.pubDate.split(' ')[0], link: item.link,
              image: `https://www.google.com/s2/favicons?domain=${realDomain}&sz=128`
            };
          });
          setLiveNews(formattedNews); 
        }
      } catch (error) { console.error("Error news:", error); }
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

  // --- LÓGICA DE SUSCRIPCIÓN (PAYPAL ONLY) ---
  // Ahora recibimos 'planType' directamente desde el componente que llama
  const handlePayPalApprove = async (data, planTypeClicked) => {
    try {
        const response = await fetch(VERIFY_PAYPAL_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                userId: user.uid, 
                orderID: data.orderID, 
                subscriptionID: data.subscriptionID,
                isSubscription: true, 
                planType: planTypeClicked // Usamos el plan que se hizo click
            })
        });
        const result = await response.json();
        if (result.success) {
            showNotification("¡Suscripción exitosa! Bienvenido a Premium.", "success");
            navigate('/perfil');
        } else {
            showNotification("El pago no pudo ser verificado.", "error");
        }
    } catch (err) { 
        showNotification("Error de comunicación.", "error"); 
        console.error(err);
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
          
          {/* Pasamos handlePayPalApprove a la vista de suscripción */}
          <Route path="/suscripcion" element={
            <SubscriptionView 
               onPayPalApprove={handlePayPalApprove} 
               isSubscribed={userData?.isSubscribed} 
               user={user} 
               handleLogin={handleLogin} 
               handleLogout={handleLogout} 
               userData={userData} 
            />
          } />
          
          <Route path="/perfil" element={<ProfileView user={user} userData={userData} courses={courses} handleLogout={handleLogout} />} />
          
          <Route path="/curso/:courseId" element={
              <CourseDetailView courses={courses} user={user} handleLogin={handleLogin} handlePayment={() => navigate('/suscripcion')} handleLogout={handleLogout} userData={userData} openRefundModal={() => setLegalModalType('refund')} />
          } />
          
          <Route path="/herramienta/:toolId" element={<ToolDetailView user={user} handleLogin={handleLogin} handleLogout={handleLogout} userData={userData} />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>

        <Footer onOpenLegal={setLegalModalType} />
        <LegalModal type={legalModalType} onClose={() => setLegalModalType(null)} />
        {showSplash && <SplashScreen finishAnimation={finishSplashAnimation} />}
        <NewsBubble news={liveNews} />
      </div>
    </PayPalScriptProvider>
  );
}