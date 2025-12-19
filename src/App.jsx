import React, { useState, useEffect, useRef, memo } from 'react';
import { 
  Play, Lock, CheckCircle, Star, Menu, X, User, 
  TrendingUp, Award, ChevronRight, Loader, LogOut, Video,
  CalendarCheck, PenTool, BookOpen, ExternalLink, ChevronDown, ChevronUp, Briefcase, ArrowRight, Sparkles, Search, Trash2, RefreshCw, ArrowLeft,
  AlertTriangle, ShieldCheck, CreditCard, Crown, Globe, RefreshCcw, Zap, Bot 
} from 'lucide-react';

// FIREBASE IMPORTS 
import { db, auth, googleProvider } from './firebase';
import { 
  collection, getDocs, doc, setDoc, updateDoc, arrayUnion, onSnapshot, query, where, writeBatch, deleteDoc, getDoc, addDoc
} from 'firebase/firestore';
import { signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';

// MERCADO PAGO IMPORT
import { initMercadoPago, Wallet } from '@mercadopago/sdk-react';

// PAYPAL IMPORT
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

// --- IMPORTAMOS LOS 15 CURSOS --- 
import { ALL_COURSES } from './content/courses_data';

// --- COMPONENTES ---
import NewsSection from './components/NewsSection';
import Footer from './components/Footer';
import LegalModal from './components/LegalModal';
import SubscriptionBanner from './components/SubscriptionBanner';
import SplashScreen from './components/SplashScreen'; 
import AIToolsView from './components/AIToolsView'; 

// ==========================================
// ⚙️ CONFIGURACIÓN GLOBAL
// ==========================================
const COURSE_PRICE = 0.50; // PRECIO EN USD
const ORIGINAL_PRICE = 15.00;

// Credenciales
const MP_PUBLIC_KEY = "APP_USR-ad8ad489-cfad-4b2f-8495-6577e3636075"; 
const PAYPAL_CLIENT_ID = "AeRiOKZeVpLALmFN9P1uv05j6ERrkj7LAcoMkTLax9H3RphI6x8Zbh9q_m3dM55TaJ1dd_G2kZihRhy6"; 
const BACKEND_URL = "https://us-central1-weberic-25da5.cloudfunctions.net/createOrder";

initMercadoPago(MP_PUBLIC_KEY, { locale: 'es-PE' });

// --- PALETA DE COLORES --- 
const COLORS = {
  bgMain: "bg-[#334E68]",       
  bgCard: "bg-[#486581]",       
  bgLighter: "bg-[#627D98]",    
  accentOrange: "bg-[#F9703E]", 
  textOrange: "text-[#F9703E]", 
  textLight: "text-[#F0F4F8]",  
  textMuted: "text-[#BCCCDC]",  
  borderSoft: "border-[#486581]", 
};

// --- FUNCIÓN HELPER ---
const formatCurrency = (amountInUSD) => {
  return `$${amountInUSD.toFixed(2)}`;
};

// --- FONDO NEURONAL (CORREGIDO: FONDO TRANSPARENTE) --- 
const NeuralBackground = memo(() => {
  const canvasRef = useRef(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    // CORRECCIÓN AQUÍ: Quitamos { alpha: false } para que el fondo vuelva a ser transparente
    const ctx = canvas.getContext('2d'); 
    let animationFrameId;
    let particles = [];
    
    // Detección de móvil para rendimiento
    const isMobile = window.innerWidth < 768;
    const particleCount = isMobile ? 25 : 60; 
    const connectionDistance = isMobile ? 100 : 160; 
    const moveSpeed = 0.4; 

    const resizeCanvas = () => { 
        canvas.width = window.innerWidth; 
        canvas.height = window.innerHeight; 
        initParticles(); 
    };
    
    window.addEventListener('resize', resizeCanvas); 
    
    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width; 
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * moveSpeed; 
        this.vy = (Math.random() - 0.5) * moveSpeed;
        this.size = Math.random() * 2 + 1;
      }
      update() {
        this.x += this.vx; this.y += this.vy;
        if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
        if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
      }
      draw() { 
        ctx.beginPath(); 
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2); 
        ctx.fillStyle = 'rgba(255, 255, 255, 0.5)'; 
        ctx.fill(); 
      }
    }

    const initParticles = () => {
        particles = [];
        for (let i = 0; i < particleCount; i++) { 
            particles.push(new Particle()); 
        }
    };

    resizeCanvas(); 
    
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach((particle, index) => {
        particle.update(); 
        particle.draw();
        
        for (let j = index; j < particles.length; j++) {
          const dx = particles[j].x - particle.x; 
          const dy = particles[j].y - particle.y;
          
          if (dx > connectionDistance || dx < -connectionDistance || dy > connectionDistance || dy < -connectionDistance) continue;

          const distance = Math.sqrt(dx * dx + dy * dy);
          if (distance < connectionDistance) { 
            ctx.beginPath(); 
            ctx.strokeStyle = `rgba(255, 255, 255, ${0.3 * (1 - distance / connectionDistance)})`; 
            ctx.lineWidth = 0.8; 
            ctx.moveTo(particle.x, particle.y); 
            ctx.lineTo(particles[j].x, particles[j].y); 
            ctx.stroke(); 
          }
        }
      });
      animationFrameId = requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => { 
        window.removeEventListener('resize', resizeCanvas); 
        cancelAnimationFrame(animationFrameId); 
    };
  }, []);
  
  return <canvas ref={canvasRef} className="fixed inset-0 z-0 pointer-events-none" style={{ background: 'transparent' }} />;
}, () => true);

const Button = ({ children, onClick, variant = 'primary', className = '', disabled = false }) => {
  const baseStyle = "px-8 py-3 rounded-full font-bold transition-all duration-300 ease-out flex items-center justify-center gap-2 text-sm tracking-wide active:scale-95 shadow-lg hover:shadow-xl transform relative z-10 select-none";
  const variants = {
    primary: `${COLORS.accentOrange} text-white hover:bg-[#DE5E2E] hover:-translate-y-1`,
    secondary: `bg-transparent border-2 border-[#F9703E] ${COLORS.textOrange} hover:bg-[#F9703E]/10`,
    outline: `bg-transparent border-2 ${COLORS.borderSoft} ${COLORS.textMuted} hover:bg-[#486581] hover:text-white`,
    google: `bg-white text-[#334E68] hover:bg-gray-100 hover:-translate-y-1`, 
    danger: "bg-[#EF4444] text-white hover:bg-[#DC2626]",
  };
  return <button onClick={onClick} disabled={disabled} className={`${baseStyle} ${variants[variant]} ${disabled ? 'opacity-60 cursor-not-allowed hover:translate-y-0' : ''} ${className}`}>{children}</button>;
};

const Badge = ({ children, color = 'orange', className = '' }) => {
  const styles = { orange: `bg-[#F9703E]/20 ${COLORS.textOrange} border border-[#F9703E]/30`, blue: `bg-[#486581] ${COLORS.textMuted} border border-[#627D98]`, light: `bg-[#F0F4F8] text-[#334E68]` };
  const finalStyle = styles[color] || styles.orange;
  return <span className={`px-4 py-1.5 rounded-full text-xs font-black tracking-wider uppercase ${finalStyle} ${className} transition-transform hover:scale-105 cursor-default select-none`}>{children}</span>;
};

// --- NAVBAR --- 
const Navbar = ({ user, userData, setView, handleLogin, handleLogout }) => (
  <nav className={`sticky top-0 z-50 bg-[#334E68]/80 border-b border-[#486581] py-3 shadow-2xl animate-slide-down backdrop-blur-md bg-opacity-95 select-none will-change-transform`}>
    <div className="max-w-7xl mx-auto px-6 flex justify-between items-center h-16">
      <div className="flex items-center gap-3 cursor-pointer group" onClick={() => setView('home')}>
        <img src="/logo.png" alt="Logo" className="w-11 h-11 object-contain group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 drop-shadow-md" />
        <span className={`font-black text-2xl ${COLORS.textLight} tracking-tight`}>
          haeric <span className={`${COLORS.textOrange} group-hover:text-white transition-colors duration-300`}>Activos</span>
        </span>
      </div>
      <div className="flex items-center gap-4">
        {user ? (
          <div className={`flex items-center gap-4 ${COLORS.bgCard} p-2 pr-4 rounded-full border border-[#627D98] shadow-inner transition-all hover:border-[#F9703E]`}>
            <img src={user.photoURL} className={`w-9 h-9 rounded-full border-2 border-[#F9703E]`} alt="user" />
            {userData?.isSubscribed && <div className={`${COLORS.accentOrange} text-white px-3 py-0.5 rounded-full text-[10px] font-bold shadow-sm animate-pulse flex items-center gap-1`}><Crown size={10}/> PRO</div>}
            <button onClick={handleLogout} className={`${COLORS.textMuted} hover:text-[#EF4444] transition-colors p-2 hover:bg-[#334E68] rounded-full`}><LogOut size={18}/></button>
          </div>
        ) : (
          <Button onClick={handleLogin} variant="google" className="text-sm font-bold rounded-full px-6 shadow-sm"><User size={18} className="text-[#334E68]"/> Entrar</Button>
        )}
      </div>
    </div>
  </nav>
);

// --- SUBSCRIPTION VIEW ---
const SubscriptionView = ({ onSubscribe, isSubscribed, setView, user, handleLogin, handleLogout, userData, goBack }) => {
  return (
    <div className={`min-h-screen pb-20 font-sans ${COLORS.textLight} animate-fade-in-up overflow-x-hidden relative z-10`}>
      <Navbar user={user} userData={userData} setView={setView} handleLogin={handleLogin} handleLogout={handleLogout} />
      
      <div className={`relative pt-10 pb-6 px-6 border-b border-[#486581] z-10 bg-[#334E68]/95 backdrop-blur-sm shadow-sm`}>
        <div className="max-w-4xl mx-auto text-center relative z-10 animate-fade-in-up">
           <button onClick={goBack} className={`group inline-flex items-center ${COLORS.textMuted} hover:text-white font-bold ${COLORS.bgCard} px-3 py-1.5 rounded-full mb-2 mx-auto transition-all border border-[#627D98] hover:border-[#F9703E] hover:-translate-x-1 text-[10px] uppercase tracking-wider`}><ChevronRight size={12} className="mr-1 rotate-180" /> Volver</button>
           <h1 className={`text-2xl md:text-3xl font-black mb-1 tracking-tight ${COLORS.textLight} leading-tight`}>Membresía <span className={COLORS.textOrange}>Premium</span></h1>
           <p className={`${COLORS.textMuted} text-xs md:text-sm max-w-xl mx-auto font-medium opacity-80`}>Accede a todos los cursos y acelera tu crecimiento.</p>
        </div>
      </div>

      <div className="pt-6">
         <SubscriptionBanner onSubscribe={onSubscribe} isSubscribed={isSubscribed} />
      </div>
    </div>
  );
};

// --- HOME VIEW --- 
const HomeView = ({ 
  courses, loadingCourses, userData, user, handleCourseClick, 
  searchTerm, setSearchTerm, 
  setView, handleLogin, handleLogout, 
  onNavigate 
}) => {
  const containerRef = useRef(null);
  const cardsRef = useRef([]); 
  const state = useRef({ position: 0, velocity: 0, isDragging: false, startX: 0, lastX: 0 });
  const requestRef = useRef();

  const filteredCourses = courses.filter(course => {
    const term = searchTerm.toLowerCase().trim();
    if (!term) return true;
    return course.title.toLowerCase().includes(term) || course.category.toLowerCase().includes(term);
  });

  const CARD_SPACING = 360; 
  const CARD_WIDTH = 340;

  useEffect(() => { state.current.position = 0; state.current.velocity = 2; }, [searchTerm]);

  const animate = () => {
    if (!containerRef.current) return;
    const s = state.current;
    
    if (!s.isDragging) { s.position += s.velocity; s.velocity *= 0.95; if (Math.abs(s.velocity) < 0.1) s.velocity = 0; }
    
    const centerOffset = window.innerWidth / 2;
    const totalWidth = filteredCourses.length * CARD_SPACING;

    if (filteredCourses.length > 0) {
      filteredCourses.forEach((course, index) => {
        const card = cardsRef.current[index];
        if (!card) return;
        let cardX = index * CARD_SPACING + s.position;
        if (totalWidth > 0) {
           while (cardX > totalWidth / 2 + centerOffset) cardX -= totalWidth;
           while (cardX < -totalWidth / 2 - centerOffset) cardX += totalWidth;
        }
        const distToCenter = (cardX + CARD_WIDTH/2) - centerOffset;
        const absDist = Math.abs(distToCenter);
        const maxDist = 600; 
        
        let scale = 1, rotateY = 0, opacity = 1, blur = 0, zIndex = 10;
        
        if (absDist < maxDist) {
          const ratio = absDist / maxDist;
          scale = 1 - (ratio * 0.25); 
          rotateY = distToCenter / 20; 
          opacity = 1 - (ratio * 0.5); 
          blur = ratio * 4; 
          zIndex = 100 - Math.round(ratio * 50);
        } else {
          scale = 0.75; opacity = 0.5; blur = 4; zIndex = 1;
        }
        
        // OPTIMIZACIÓN: will-change ya está en el CSS inline
        card.style.transform = `translate3d(${cardX}px, 0, 0) perspective(1000px) rotateY(${rotateY}deg) scale(${scale})`;
        card.style.opacity = opacity; 
        card.style.filter = `blur(${blur}px)`; 
        card.style.zIndex = zIndex; 
        card.style.borderColor = absDist < 150 ? '#F9703E' : '#627D98';
      });
    }
    requestRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => { requestRef.current = requestAnimationFrame(animate); return () => cancelAnimationFrame(requestRef.current); }, [filteredCourses]);

  const handleStart = (clientX) => { const s = state.current; s.isDragging = true; s.startX = clientX; s.lastX = clientX; s.velocity = 0; };
  const handleMove = (clientX) => { const s = state.current; if (!s.isDragging) return; const delta = clientX - s.lastX; s.position += delta; s.lastX = clientX; s.velocity = delta; };
  const handleEnd = () => { state.current.isDragging = false; };
  const handleCardClick = (course) => { if (Math.abs(state.current.velocity) > 2) return; handleCourseClick(course); };

  return (
    <div className={`pb-20 min-h-screen font-sans relative z-10 overflow-x-hidden select-none`}>
      <Navbar user={user} userData={userData} setView={setView} handleLogin={handleLogin} handleLogout={handleLogout} />
      
      <div className={`relative py-12 px-6 text-center overflow-hidden z-10`}>
        <div className="max-w-5xl mx-auto relative animate-fade-in-up">
          <Badge color="orange" className="mb-6 shadow-lg inline-block"><Sparkles size={14} className="inline mr-1 animate-pulse"/> CATÁLOGO PREMIUM</Badge>
          
          <h1 className={`text-3xl md:text-5xl font-black mb-8 tracking-tight leading-tight ${COLORS.textLight} drop-shadow-2xl flex flex-col items-center perspective-500`}>
            <span className="block animate-pop-in opacity-0" style={{animationDelay: '0.2s', animationFillMode: 'forwards'}}>
              Crea activos con IA,
            </span>
            <span className="block mt-2 relative animate-fade-in-up opacity-0 group" style={{animationDelay: '0.5s', animationFillMode: 'forwards'}}>
              <span className={`bg-gradient-to-r from-[#F9703E] to-[#FF5722] bg-clip-text text-transparent inline-block transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-2 cursor-default`}>
                  Monetiza desde hoy.
              </span>
              <span className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-[110%] h-8 bg-[#F9703E]/40 blur-[20px] animate-pulse-slow rounded-full opacity-80 -z-10 group-hover:bg-[#F9703E]/70 group-hover:blur-[30px] transition-all duration-500"></span>
            </span>
          </h1>
          
          {(!userData?.isSubscribed) && (
            <div className="mt-8 animate-fade-in-up" style={{animationDelay: '0.8s', animationFillMode: 'forwards', opacity: 0}}>
              <button 
                onClick={() => onNavigate('subscription')}
                className={`group relative inline-flex items-center gap-3 px-8 py-4 rounded-full bg-gradient-to-r from-[#F9703E] to-[#D64515] text-white font-black text-lg shadow-2xl hover:shadow-[#F9703E]/50 hover:-translate-y-1 transition-all duration-300 overflow-hidden`}
              >
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                <Zap size={24} fill="currentColor" className="animate-pulse" />
                <span className="relative z-10">Suscríbete y accede a TODO</span>
                <ChevronRight size={20} className="relative z-10 group-hover:translate-x-1 transition-transform" />
              </button>
              <p className={`mt-3 text-xs font-bold ${COLORS.textMuted} tracking-wide`}>Cancela cuando quieras • Acceso inmediato</p>
            </div>
          )}

        </div>
      </div>
      
      <div className="relative z-30 px-6 mb-12 animate-fade-in-up" style={{animationDelay: '1s', animationFillMode: 'forwards', opacity: 0}}>
        <div className="max-w-xl mx-auto relative group">
          <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none"><Search className={`h-6 w-6 ${COLORS.textMuted} group-focus-within:text-[#F9703E] transition-colors`} /></div>
          <input type="text" placeholder="Buscar (ej: YouTube, Dinero, Web...)" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className={`w-full pl-14 pr-6 py-4 rounded-full border border-[#627D98] ${COLORS.bgCard} shadow-2xl text-lg font-bold ${COLORS.textLight} placeholder:${COLORS.textMuted} focus:outline-none focus:border-[#F9703E] focus:ring-1 focus:ring-[#F9703E] transition-all duration-300 focus:shadow-[#F9703E]/20 select-text`}/>
        </div>
      </div>
      
      <div ref={containerRef} className="relative w-full h-[600px] z-10 cursor-grab active:cursor-grabbing touch-pan-y outline-none animate-fade-in-up" style={{animationDelay: '1.2s', animationFillMode: 'forwards', opacity: 0}} onTouchStart={(e) => handleStart(e.touches[0].clientX)} onTouchMove={(e) => handleMove(e.touches[0].clientX)} onTouchEnd={handleEnd} onMouseDown={(e) => handleStart(e.clientX)} onMouseMove={(e) => { if(state.current.isDragging) { e.preventDefault(); handleMove(e.clientX); }}} onMouseUp={handleEnd} onMouseLeave={handleEnd}>
        {loadingCourses ? <div className="flex justify-center h-full items-center"><Loader className={`animate-spin ${COLORS.textOrange}`} size={50}/></div> : filteredCourses.length === 0 ? <div className="text-center pt-20"><p className={`${COLORS.textMuted} text-xl font-bold`}>No encontramos cursos 🔍</p><button onClick={() => setSearchTerm("")} className={`mt-4 ${COLORS.textOrange} font-bold underline hover:text-white transition-colors`}>Ver todos</button></div> : (
          <div className="relative w-full h-full overflow-hidden">
            {filteredCourses.map((course, index) => {
               const isUnlocked = course.isFree || userData?.isSubscribed || userData?.purchasedCourses?.includes(course.id);
               return (
                <div key={course.id} ref={el => cardsRef.current[index] = el} className={`absolute top-10 left-0 w-[300px] md:w-[340px] h-[500px] rounded-[2.5rem] bg-[#486581] border-2 border-[#627D98] shadow-2xl overflow-hidden flex flex-col hover:border-[#F9703E] will-change-transform`} style={{ transform: 'translate3d(-1000px, 0, 0)', willChange: 'transform' }}>
                  <div className="relative h-64 overflow-hidden pointer-events-none">
                    <img src={course.image} alt={course.title} loading="lazy" decoding="async" className="w-full h-full object-cover select-none" draggable="false" />
                    <div className="absolute top-5 left-5"><Badge color="light">{course.category}</Badge></div>
                    {!isUnlocked && <div className="absolute inset-0 flex items-center justify-center bg-[#334E68]/70 backdrop-blur-[2px]"><div className={`${COLORS.bgLighter} p-4 rounded-full shadow-xl border border-[#F0F4F8]/20`}><Lock className="text-[#F0F4F8]" size={28} /></div></div>}
                  </div>
                  <div className="p-8 flex-1 flex flex-col pointer-events-none">
                    <h3 className={`text-2xl font-black ${COLORS.textLight} mb-3 leading-tight line-clamp-2`}>{course.title}</h3>
                    <p className={`${COLORS.textMuted} text-sm mb-6 line-clamp-3 font-medium`}>{course.description}</p>
                    <div className="mt-auto flex justify-between items-center pt-4 border-t border-[#627D98] pointer-events-auto">
                        <span className={`text-xs font-bold ${COLORS.textMuted} flex items-center gap-2`}><CalendarCheck size={16} className={COLORS.textOrange}/> {course.duration}</span>
                        <div className="flex flex-col items-end gap-0.5">
                          {!isUnlocked && (
                            <span className="text-[10px] text-[#BCCCDC] font-bold line-through decoration-[#F9703E]/70 decoration-2">
                              {formatCurrency(ORIGINAL_PRICE)}
                            </span>
                          )}
                          <button onClick={(e) => { e.stopPropagation(); handleCardClick(course); }} className={`${isUnlocked ? 'bg-[#48BB78]/20 text-[#48BB78]' : `${COLORS.accentOrange} text-white`} px-5 py-2.5 rounded-full font-bold text-sm shadow-md hover:scale-105 transition-transform cursor-pointer`}>
                            {isUnlocked ? 'Acceder' : formatCurrency(COURSE_PRICE)}
                          </button>
                        </div>
                    </div>
                  </div>
                </div>
               );
            })}
          </div>
        )}
      </div>
      <NewsSection />
    </div>
  );
};

// --- COURSE DETAIL VIEW --- 
const CourseDetailView = ({ selectedCourse, isRich, setView, user, handleLogin, handlePayment, handleLogout, userData, openRefundModal, goBack }) => {
  const [activeTab, setActiveTab] = useState(isRich ? 'plan' : 'video');
  const [expandedWeek, setExpandedWeek] = useState(null);
  const isOwned = userData?.purchasedCourses?.includes(selectedCourse?.id) || userData?.isSubscribed;

  return (
    <div className={`min-h-screen pb-20 font-sans ${COLORS.textLight} animate-fade-in-up overflow-x-hidden relative z-10`}>
      <Navbar user={user} userData={userData} setView={setView} handleLogin={handleLogin} handleLogout={handleLogout} />
      
      <div className={`relative pt-20 pb-36 px-6 border-b border-[#486581] z-10 bg-[#334E68]/80 backdrop-blur-sm`}>
        <div className="max-w-5xl mx-auto text-center relative z-10 animate-fade-in-up">
          <button onClick={goBack} className={`group flex items-center ${COLORS.textMuted} hover:text-white font-bold ${COLORS.bgCard} px-5 py-2.5 rounded-full mb-8 mx-auto transition-all border border-[#627D98] hover:border-[#F9703E] hover:-translate-x-1`}><ChevronRight size={18} className="mr-2 rotate-180" /> Volver</button>
          
          <div className="flex flex-wrap gap-3 mb-6 justify-center">
            <Badge color="light">{selectedCourse.category}</Badge>
            {isRich && <Badge color="orange"><Sparkles size={12} className="mr-1 inline-block animate-spin-slow"/> PREMIUM</Badge>}
          </div>
          <h1 className={`text-4xl md:text-6xl font-black mb-6 tracking-tight ${COLORS.textLight} leading-tight drop-shadow-xl`}>{selectedCourse.title}</h1>
          <p className={`${COLORS.textMuted} text-lg max-w-3xl mx-auto font-medium opacity-90 leading-relaxed`}>{selectedCourse.longDescription || selectedCourse.description}</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 -mt-24 relative z-20 animate-fade-in-up" style={{animationDelay: '0.2s'}}>
        <div className={`${COLORS.bgCard} rounded-[3rem] border border-[#627D98] shadow-2xl overflow-hidden min-h-[600px] p-2 bg-opacity-95 backdrop-blur-xl`}>
          <div className={`flex flex-wrap justify-center gap-2 p-3 ${COLORS.bgMain} rounded-[2.5rem] mb-6 mx-2 mt-2 border border-[#486581]`}>
            {isRich ? (
              <>
                {['plan', 'syllabus', 'tools'].map((tab) => (
                  <button key={tab} onClick={() => setActiveTab(tab)} className={`py-3 px-8 rounded-full text-sm font-bold flex gap-2 items-center transition-all duration-300 ${activeTab === tab ? `${COLORS.accentOrange} text-white shadow-md scale-105` : `${COLORS.textMuted} hover:text-white hover:bg-[#486581]`}`}>
                    {tab === 'plan' && <CalendarCheck size={18}/>}
                    {tab === 'syllabus' && <BookOpen size={18}/>}
                    {tab === 'tools' && <PenTool size={18}/>}
                    {tab === 'plan' ? 'Plan' : tab === 'syllabus' ? 'Temario' : 'Herramientas'}
                  </button>
                ))}
              </>
            ) : (
              <button className={`py-3 px-8 rounded-full font-bold ${COLORS.accentOrange} text-white shadow-md`}>Video Clase</button>
            )}
          </div>

          <div className="p-8 md:p-12 h-full">
            {activeTab === 'plan' && isRich && (
              <div className="space-y-5 max-w-3xl mx-auto">
                {selectedCourse.actionPlan.map((week, index) => (
                  <div key={week.week} className={`group ${COLORS.bgMain} border ${expandedWeek === week.week ? 'border-[#F9703E] shadow-md' : 'border-[#486581]'} rounded-2xl overflow-hidden transition-all duration-300 animate-fade-in-up`} style={{animationDelay: `${index * 0.1}s`}}>
                    <div onClick={() => setExpandedWeek(expandedWeek === week.week ? null : week.week)} className={`p-6 flex items-center justify-between cursor-pointer hover:bg-[#486581]/50 transition-colors`}>
                      <div className="flex items-center gap-6">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-black text-xl transition-all ${expandedWeek === week.week ? `${COLORS.accentOrange} text-white rotate-3 scale-110` : `${COLORS.bgCard} ${COLORS.textMuted} border border-[#627D98]`}`}>{week.week}</div>
                        <div><p className={`text-[10px] ${COLORS.textOrange} uppercase font-bold tracking-widest mb-1`}>Semana {week.week}</p><h4 className={`font-bold ${COLORS.textLight} text-lg`}>{week.title}</h4></div>
                      </div>
                      <ChevronDown size={24} className={`${COLORS.textMuted} transition-transform duration-300 ${expandedWeek === week.week ? `rotate-180 ${COLORS.textOrange}` : ''}`}/>
                    </div>
                    {expandedWeek === week.week && <div className={`px-6 pb-8 pt-2 border-t border-[#486581] animate-fade-in-up`}><ul className="space-y-4">{week.tasks.map((task, i) => <li key={i} className={`flex items-start gap-4 ${COLORS.textLight} text-sm font-medium`}><CheckCircle size={20} className={`${COLORS.textOrange} flex-shrink-0 mt-0.5`} /><span>{task}</span></li>)}</ul></div>}
                  </div>
                ))}
              </div>
            )}
            {activeTab === 'syllabus' && isRich && (
              <div className="space-y-8 max-w-3xl mx-auto">
                {selectedCourse.syllabus.map((mod, i) => (
                  <div key={i} className={`${COLORS.bgMain} p-8 rounded-[2rem] border border-[#486581] shadow-lg hover:border-[#627D98] transition-all animate-fade-in-up`} style={{animationDelay: `${i * 0.1}s`}}>
                    <h3 className={`font-bold text-xl ${COLORS.textLight} mb-6 flex items-center gap-4`}><span className={`${COLORS.accentOrange} text-white w-10 h-10 rounded-xl flex items-center justify-center text-base font-black shadow-sm`}>{i+1}</span>{mod.title}</h3>
                    <div className={`space-y-6 pl-5 border-l-2 border-[#627D98] ml-5`}>{mod.content.map((item, j) => (<div key={j} className="relative pl-6"><div className={`absolute left-[-0.4rem] top-1.5 w-3 h-3 rounded-full ${COLORS.accentOrange}`}></div><h5 className={`font-bold ${COLORS.textLight} text-lg mb-2`}>{item.subtitle}</h5><p className={`${COLORS.textMuted} leading-relaxed text-sm ${COLORS.bgCard} p-4 rounded-xl border border-[#486581]`}>{item.text}</p></div>))}</div>
                  </div>
                ))}
              </div>
            )}
            {activeTab === 'tools' && isRich && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                {selectedCourse.tools.map((tool, i) => (
                  <a key={i} href={tool.link} target="_blank" rel="noopener noreferrer" className={`${COLORS.bgMain} p-6 rounded-2xl border border-[#486581] hover:border-[#F9703E] transition-all duration-300 group flex items-start gap-5 hover:-translate-y-2 shadow-md hover:shadow-2xl animate-fade-in-up`} style={{animationDelay: `${i * 0.1}s`}}>
                    <div className={`${COLORS.bgCard} p-4 rounded-xl group-hover:${COLORS.accentOrange} transition-colors border border-[#627D98] duration-300`}><PenTool size={24} className={`${COLORS.textMuted} group-hover:text-white transition-colors`}/></div>
                    <div><h4 className={`font-bold ${COLORS.textLight} text-lg flex items-center gap-2 mb-2 group-hover:${COLORS.textOrange} transition-colors`}>{tool.name} <ExternalLink size={16} className="opacity-50"/></h4><p className={`${COLORS.textMuted} text-sm`}>{tool.desc}</p></div>
                  </a>
                ))}
              </div>
            )}
            {(!isRich || activeTab === 'video') && <div className="flex flex-col items-center justify-center text-center h-full py-24 animate-fade-in-up"><div className={`${COLORS.bgMain} p-10 rounded-full mb-8 text-[#627D98] border border-[#486581] animate-float`}><Video size={60}/></div><h3 className={`font-bold text-2xl ${COLORS.textLight} mb-3`}>Video Introductorio</h3><p className={COLORS.textMuted}>Contenido próximamente.</p></div>}
          </div>
          
          {isOwned && (
            <div className="flex justify-center mt-12 mb-4 animate-fade-in-up">
              <button onClick={openRefundModal} className="flex items-center gap-2 text-sm font-bold text-[#BCCCDC] hover:text-[#EF4444] transition-colors opacity-70 hover:opacity-100">
                <AlertTriangle size={16} /> ¿Problemas con el curso? Solicitar Reembolso
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// --- APP PRINCIPAL --- 
export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [finishSplashAnimation, setFinishSplashAnimation] = useState(false);
  
  const [view, setView] = useState('home'); 
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [isSubscriptionPayment, setIsSubscriptionPayment] = useState(false); 
  const [paymentMethod, setPaymentMethod] = useState('mercadopago');
  
  const [showRefundModal, setShowRefundModal] = useState(false);
  const [refundReason, setRefundReason] = useState("");
  const [legalModalType, setLegalModalType] = useState(null); 
  const [notification, setNotification] = useState(null);
  const [isLoadingPayment, setIsLoadingPayment] = useState(false);
  const [preferenceId, setPreferenceId] = useState(null);

  const [courses, setCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState(""); 
  const [loadingCourses, setLoadingCourses] = useState(true);
  const [user, setUser] = useState(null); 
  const [userData, setUserData] = useState({ purchasedCourses: [], isSubscribed: false });

  // --- EFECTO: SPLASH TIMER ---
  useEffect(() => {
    const timerExit = setTimeout(() => { setFinishSplashAnimation(true); }, 2500);
    const timerRemove = setTimeout(() => { setShowSplash(false); }, 3000);
    return () => { clearTimeout(timerExit); clearTimeout(timerRemove); };
  }, []);

  // --- MANEJO DEL HISTORIAL DEL NAVEGADOR ---
  useEffect(() => {
    const handlePopState = (event) => {
      if (event.state) {
        setView(event.state.view);
        setSelectedCourse(event.state.course || null);
      } else {
        setView('home');
        setSelectedCourse(null);
      }
    };
    window.history.replaceState({ view: 'home', course: null }, '');
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // --- FUNCIÓN CENTRAL PARA NAVEGAR ---
  const navigateTo = (newView, course = null) => {
    window.history.pushState({ view: newView, course }, '');
    setView(newView);
    if (course) setSelectedCourse(course);
    window.scrollTo(0, 0); 
  };

  const goBack = () => {
    if (view !== 'home') {
      window.history.back(); 
    } else {
      navigateTo('home');
    }
  };

  // ===============================================
  // 🟢 EFECTO: DETECTOR DE RETORNO DE PAGO MERCADO PAGO
  // ===============================================
  useEffect(() => {
    // 1. Leemos la URL actual
    const query = new URLSearchParams(window.location.search);
    const status = query.get('status');
    const courseId = query.get('course_id');

    // 2. Si el pago fue aprobado y hay un usuario logueado...
    if (status === 'approved' && user && courseId) {
      
      const unlockContent = async () => {
        try {
          const userRef = doc(db, "users", user.uid);
          
          if (courseId === 'SUB-PREMIUM-MONTHLY') {
             // Es una suscripción
             await updateDoc(userRef, { isSubscribed: true });
             setUserData(prev => ({ ...prev, isSubscribed: true }));
             showNotification("¡Suscripción Activada! 🚀", "success");
          } else {
             // Es un curso individual
             await updateDoc(userRef, { purchasedCourses: arrayUnion(courseId) });
             setUserData(prev => ({ 
               ...prev, 
               purchasedCourses: [...(prev.purchasedCourses || []), courseId] 
             }));
             showNotification("¡Curso Desbloqueado! 📚", "success");
          }

          // Limpiamos la URL para que no se ejecute de nuevo al refrescar
          window.history.replaceState({}, document.title, window.location.pathname);
          
        } catch (error) {
          console.error("Error guardando compra MP:", error);
          showNotification("Error guardando el curso. Contáctanos.", "error");
        }
      };

      unlockContent();
    }
  }, [user]); // Se ejecuta cuando el usuario carga o cambia

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const cachedCourses = localStorage.getItem('haeric_courses_cache');
        const cacheTimestamp = localStorage.getItem('haeric_courses_timestamp');
        const isCacheValid = cacheTimestamp && (Date.now() - parseInt(cacheTimestamp) < 24 * 60 * 60 * 1000);
        if (cachedCourses && isCacheValid) { setCourses(JSON.parse(cachedCourses)); setLoadingCourses(false); } 
        else { const querySnapshot = await getDocs(collection(db, "courses")); const coursesData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })); setCourses(coursesData); localStorage.setItem('haeric_courses_cache', JSON.stringify(coursesData)); localStorage.setItem('haeric_courses_timestamp', Date.now().toString()); setLoadingCourses(false); }
      } catch (error) { console.error("Error courses:", error); setLoadingCourses(false); }
    };
    fetchCourses();
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const userDocRef = doc(db, "users", currentUser.uid);
        try {
          const docSnap = await getDoc(userDocRef);
          if (docSnap.exists()) { setUserData(docSnap.data()); } 
          else { const newUserData = { email: currentUser.email, purchasedCourses: [], isSubscribed: false }; await setDoc(userDocRef, newUserData, { merge: true }); setUserData(newUserData); }
        } catch (error) { console.error("Error fetching user data:", error); }
      } else { setUserData({ purchasedCourses: [], isSubscribed: false }); }
    });
    return () => unsubscribe();
  }, []);

  const resetDatabase = async () => {
    if (!confirm("⚠️ ¡PELIGRO! Esto borrará TODOS los cursos. ¿Continuar?")) return;
    try {
      const querySnapshot = await getDocs(collection(db, "courses")); const batchDelete = writeBatch(db); querySnapshot.forEach((doc) => batchDelete.delete(doc.ref)); await batchDelete.commit();
      const batchUpload = writeBatch(db); ALL_COURSES.forEach((courseData) => { const newDocRef = doc(collection(db, "courses")); batchUpload.set(newDocRef, courseData); }); await batchUpload.commit();
      localStorage.removeItem('haeric_courses_cache'); localStorage.removeItem('haeric_courses_timestamp');
      showNotification("¡Base de datos REINICIADA!", "success"); setTimeout(() => window.location.reload(), 2000);
    } catch (e) { console.error(e); }
  };

  const handleLogin = async () => { try { await signInWithPopup(auth, googleProvider); showNotification("¡Bienvenido!", "success"); } catch (error) { showNotification("Error login", "error"); } };
  const handleLogout = async () => { await signOut(auth); setView('home'); };
  const showNotification = (msg, type = 'success') => { setNotification({ msg, type }); setTimeout(() => setNotification(null), 4000); };

  const handleCourseClick = (course) => {
    // 🛡️ PROTECCIÓN AQUÍ
    const isUnlocked = course.isFree || userData?.isSubscribed || userData?.purchasedCourses?.includes(course.id);
    if (isUnlocked) { 
      navigateTo('course-detail', course); 
    } 
    else {
      if (!user) { showNotification("Inicia sesión primero", "error"); handleLogin(); return; }
      setSelectedCourse(course);
      setIsSubscriptionPayment(false); 
      setPreferenceId(null);
      setPaymentMethod('mercadopago');
      setShowPaymentModal(true);
    }
  };

  const handleSubscriptionClick = () => {
    if (!user) { showNotification("Inicia sesión para suscribirte", "error"); handleLogin(); return; }
    setIsSubscriptionPayment(true);
    setPreferenceId(null);
    setPaymentMethod('mercadopago');
    setShowPaymentModal(true);
  };

  // --- LÓGICA DE PAGO MERCADO PAGO ---
  const createPreference = async () => {
    setIsLoadingPayment(true);
    try {
      let title, id;

      if (isSubscriptionPayment) { 
        title = "Suscripción Premium Mensual"; 
        id = "SUB-PREMIUM-MONTHLY"; 
      } else { 
        title = `Curso: ${selectedCourse.title}`; 
        id = selectedCourse.id; 
      }
      
      const response = await fetch(BACKEND_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // IMPORTANTE: Enviamos userId para que el backend pueda inyectarlo en la URL de retorno
        body: JSON.stringify({ 
          id, 
          title, 
          price: COURSE_PRICE,
          userId: user.uid 
        }), 
      });

      if (!response.ok) { const errorText = await response.text(); throw new Error(`Backend Error: ${errorText}`); }
      const data = await response.json();
      setPreferenceId(data.id); 
    } catch (error) { console.error("Error Fetch:", error); showNotification(`Error Conexión: ${error.message}`, "error"); } 
    finally { setIsLoadingPayment(false); }
  };

  // --- LÓGICA DE PAGO PAYPAL (SUCCESS) ---
  const handlePayPalApprove = async (data, actions) => {
    try {
      const userRef = doc(db, "users", user.uid);
      if (isSubscriptionPayment) {
        await updateDoc(userRef, { isSubscribed: true });
        setUserData(prev => ({ ...prev, isSubscribed: true }));
      } else {
        await updateDoc(userRef, { purchasedCourses: arrayUnion(selectedCourse.id) });
        setUserData(prev => ({ ...prev, purchasedCourses: [...prev.purchasedCourses, selectedCourse.id] }));
      }
      showNotification("¡Pago Exitoso con PayPal!", "success");
      setShowPaymentModal(false);
    } catch (err) {
      console.error(err);
      showNotification("Error guardando compra", "error");
    }
  };

  const handleRefundRequest = async () => {
    if(!refundReason.trim()) { showNotification("Escribe un motivo", "error"); return; }
    setIsLoadingPayment(true);
    try {
      await addDoc(collection(db, "refund_requests"), {
        userId: user.uid, userEmail: user.email,
        courseId: selectedCourse?.id || "subscription",
        courseTitle: selectedCourse?.title || "Suscripción",
        reason: refundReason, status: "pending", date: new Date()
      });
      showNotification("Solicitud enviada.", "success"); setShowRefundModal(false); setRefundReason("");
    } catch (error) { showNotification("Error al enviar", "error"); } finally { setIsLoadingPayment(false); }
  };

  return (
    <PayPalScriptProvider options={{ "client-id": PAYPAL_CLIENT_ID, currency: "USD" }}>
      
      <div className={`font-sans ${COLORS.textLight} ${COLORS.bgMain} min-h-screen selection:bg-[#F9703E] selection:text-white relative animate-fade-in`}>
        
        {/* FONDO NEURONAL OPTIMIZADO (FONDO AZUL RESTAURADO) */}
        <NeuralBackground />

        {notification && <div className={`fixed top-8 left-1/2 transform -translate-x-1/2 z-[100] px-8 py-4 rounded-full shadow-2xl flex items-center gap-4 animate-pop-in ${COLORS.bgCard} border border-[#627D98] ${notification.type === 'error' ? 'text-red-400' : COLORS.textOrange} text-base font-bold`}><CheckCircle size={24} /> {notification.msg}</div>}
        
        {view === 'home' && (
          <HomeView 
            courses={courses} loadingCourses={loadingCourses} userData={userData} user={user} 
            handleCourseClick={handleCourseClick} searchTerm={searchTerm} setSearchTerm={setSearchTerm} 
            setView={setView} handleLogin={handleLogin} handleLogout={handleLogout} resetDatabase={resetDatabase}
            openLegalModal={setLegalModalType} handleSubscribe={handleSubscriptionClick}
            onNavigate={navigateTo} 
          />
        )}
        
        {view === 'tools' && (
          <AIToolsView setView={setView} />
        )}

        {view === 'subscription' && (
          <SubscriptionView 
            onSubscribe={handleSubscriptionClick} 
            isSubscribed={userData?.isSubscribed}
            setView={setView} user={user} handleLogin={handleLogin} handleLogout={handleLogout}
            userData={userData} goBack={goBack}
          />
        )}

        {view === 'course-detail' && (
          <CourseDetailView 
            selectedCourse={selectedCourse} isRich={selectedCourse?.isRichContent} setView={setView} user={user} 
            handleLogin={handleLogin} handlePayment={() => { setIsSubscriptionPayment(false); createPreference(); }} 
            handleLogout={handleLogout} resetDatabase={resetDatabase} userData={userData} openRefundModal={() => setShowRefundModal(true)}
            goBack={goBack}
          />
        )}

        {view !== 'tools' && (
          <button
            onClick={() => navigateTo('tools')} 
            className={`fixed bottom-8 right-8 w-20 h-20 bg-[#F9703E] rounded-full shadow-2xl z-50 flex flex-col items-center justify-center border-4 border-[#334E68] hover:scale-110 transition-all group animate-bounce-slow`}
          >
            <Bot size={28} className="text-white mb-0.5 group-hover:rotate-12 transition-transform" />
            <span className="text-[9px] font-black text-white leading-none">TOOLS IA</span>
          </button>
        )}

        {showPaymentModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#102A43]/80 backdrop-blur-sm animate-fade-in-up">
              <div className={`${COLORS.bgCard} rounded-[2rem] shadow-2xl max-w-md w-full p-8 text-center relative max-h-[90vh] overflow-y-auto border border-[#627D98] animate-pop-in`}>
                <div className={`absolute top-0 left-0 w-full h-2 ${COLORS.accentOrange}`}></div>
                <h3 className={`text-3xl font-black mb-2 ${COLORS.textLight} leading-tight`}>{isSubscriptionPayment ? "Pase Premium" : "Desbloquea tu Potencial"}</h3>
                
                <div className={`${COLORS.bgMain} p-4 rounded-2xl mb-6 border border-[#486581]`}>
                  <p className={`text-[10px] ${COLORS.textOrange} font-bold uppercase tracking-widest mb-1`}>Total a Pagar</p>
                  <p className={`text-4xl font-black ${COLORS.textLight}`}>
                    {formatCurrency(COURSE_PRICE)}
                  </p>
                  <p className="text-[10px] text-[#BCCCDC] mt-1">Pagos procesados en Dólares (USD)</p>
                </div>

                <div className="flex gap-2 mb-6 bg-[#334E68] p-1 rounded-xl">
                  <button onClick={() => setPaymentMethod('mercadopago')} className={`flex-1 py-2 rounded-lg font-bold text-xs flex items-center justify-center gap-2 transition-all ${paymentMethod === 'mercadopago' ? 'bg-[#486581] text-white shadow-sm' : 'text-[#BCCCDC] hover:text-white'}`}><CreditCard size={14} /> Tarjeta / Yape</button>
                  <button onClick={() => setPaymentMethod('paypal')} className={`flex-1 py-2 rounded-lg font-bold text-xs flex items-center justify-center gap-2 transition-all ${paymentMethod === 'paypal' ? 'bg-[#003087] text-white shadow-sm' : 'text-[#BCCCDC] hover:text-white'}`}><Globe size={14} /> PayPal</button>
                </div>
                
                {paymentMethod === 'mercadopago' ? (!preferenceId ? (<Button onClick={createPreference} variant="primary" className="w-full h-14 text-lg shadow-lg hover:scale-105 transition-transform">{isLoadingPayment ? <Loader className="animate-spin"/> : "Continuar con Mercado Pago"}</Button>) : (<div className="animate-fade-in-up"><Wallet initialization={{ preferenceId: preferenceId }} customization={{ texts:{ valueProp: 'smart_option'}}} /></div>)) : (
                  <div className="animate-fade-in-up z-10 relative">
                    <PayPalButtons 
                      style={{ layout: "vertical", shape: "pill" }} 
                      createOrder={(data, actions) => { 
                        return actions.order.create({ 
                          purchase_units: [{ 
                            amount: { value: COURSE_PRICE.toString() }, 
                            description: isSubscriptionPayment ? "Suscripción Premium" : selectedCourse.title 
                          }] 
                        }); 
                      }} 
                      onApprove={handlePayPalApprove} 
                    />
                  </div>
                )}
                
                <button onClick={() => setShowPaymentModal(false)} className={`w-full mt-6 text-sm font-bold ${COLORS.textMuted} hover:text-white transition-colors uppercase tracking-wider`}>Cancelar</button>
              </div>
            </div>
        )}

        <LegalModal type={legalModalType} onClose={() => setLegalModalType(null)} />
        {view === 'home' && <Footer onOpenLegal={setLegalModalType} />}
      </div>

      {showSplash && (
        <SplashScreen finishAnimation={finishSplashAnimation} />
      )}

    </PayPalScriptProvider>
  );
}