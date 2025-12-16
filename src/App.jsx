import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, Lock, CheckCircle, Star, Menu, X, User, 
  TrendingUp, Award, ChevronRight, Loader, LogOut, Video,
  CalendarCheck, PenTool, BookOpen, ExternalLink, ChevronDown, ChevronUp, Briefcase, ArrowRight, Sparkles, Search, Trash2, RefreshCw, ArrowLeft
} from 'lucide-react';

// FIREBASE IMPORTS
import { db, auth, googleProvider } from './firebase';
import { 
  collection, getDocs, doc, setDoc, updateDoc, arrayUnion, onSnapshot, query, where, writeBatch, deleteDoc
} from 'firebase/firestore';
import { signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';

// --- IMPORTAMOS LOS 15 CURSOS ---
import { ALL_COURSES } from './content/courses_data';

// --- PALETA DE COLORES ---
const COLORS = {
  bgMain: "bg-[#334E68]",       // Azul Pizarra Profundo
  bgCard: "bg-[#486581]",       // Azul Pizarra Medio
  bgLighter: "bg-[#627D98]",    // Azul Pizarra Claro
  
  accentOrange: "bg-[#F9703E]", // Naranja Quemado Vibrante
  textOrange: "text-[#F9703E]", // Texto Naranja
  
  textLight: "text-[#F0F4F8]",  // Blanco Grisáceo
  textMuted: "text-[#BCCCDC]",  // Gris Azulado Claro
  
  borderSoft: "border-[#486581]", 
};

// --- COMPONENTE DE FONDO NEURONAL ---
const NeuralBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let particles = [];

    const particleCount = 70; 
    const connectionDistance = 160; 
    const moveSpeed = 0.4; 

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * moveSpeed;
        this.vy = (Math.random() - 0.5) * moveSpeed;
        this.size = Math.random() * 2 + 1;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;
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

    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((particle, index) => {
        particle.update();
        particle.draw();
        for (let j = index; j < particles.length; j++) {
          const dx = particles[j].x - particle.x;
          const dy = particles[j].y - particle.y;
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
};

// --- COMPONENTES UI REUTILIZABLES ---

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
  const styles = { 
    orange: `bg-[#F9703E]/20 ${COLORS.textOrange} border border-[#F9703E]/30`, 
    blue: `bg-[#486581] ${COLORS.textMuted} border border-[#627D98]`, 
    light: `bg-[#F0F4F8] text-[#334E68]`,
  };
  const finalStyle = styles[color] || styles.orange;
  return <span className={`px-4 py-1.5 rounded-full text-xs font-black tracking-wider uppercase ${finalStyle} ${className} transition-transform hover:scale-105 cursor-default select-none`}>{children}</span>;
};

// --- NAVBAR ---
const Navbar = ({ user, userData, setView, handleLogin, handleLogout }) => (
  <nav className={`sticky top-0 z-50 bg-[#334E68]/80 border-b border-[#486581] py-3 shadow-2xl animate-slide-down backdrop-blur-md bg-opacity-95 select-none`}>
    <div className="max-w-7xl mx-auto px-6 flex justify-between items-center h-16">
      <div className="flex items-center gap-3 cursor-pointer group" onClick={() => setView('home')}>
        <img src="/logo.png" alt="Logo haeric Activos" className="w-11 h-11 object-contain group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 drop-shadow-md" />
        <span className={`font-black text-2xl ${COLORS.textLight} tracking-tight`}>
          haeric <span className={`${COLORS.textOrange} group-hover:text-white transition-colors duration-300`}>Activos</span>
        </span>
      </div>
      <div className="flex items-center gap-4">
        {/* BOTÓN RESET ELIMINADO AQUÍ */}
        
        {user ? (
          <div className={`flex items-center gap-4 ${COLORS.bgCard} p-2 pr-4 rounded-full border border-[#627D98] shadow-inner transition-all hover:border-[#F9703E]`}>
            <img src={user.photoURL} className={`w-9 h-9 rounded-full border-2 border-[#F9703E]`} alt="user" />
            {userData.isSubscribed && <div className={`${COLORS.accentOrange} text-white px-3 py-0.5 rounded-full text-[10px] font-bold shadow-sm animate-pulse`}>PRO</div>}
            <button onClick={handleLogout} className={`${COLORS.textMuted} hover:text-[#EF4444] transition-colors p-2 hover:bg-[#334E68] rounded-full`}><LogOut size={18}/></button>
          </div>
        ) : (
          <Button onClick={handleLogin} variant="google" className="text-sm font-bold rounded-full px-6 shadow-sm"><User size={18} className="text-[#334E68]"/> Entrar</Button>
        )}
      </div>
    </div>
  </nav>
);

// --- HOME VIEW ---
const HomeView = ({ 
  courses, loadingCourses, userData, user, handleCourseClick, 
  searchTerm, setSearchTerm, 
  setView, handleLogin, handleLogout 
}) => {
  
  const containerRef = useRef(null);
  const cardsRef = useRef([]); 
  
  const state = useRef({
    position: 0,
    velocity: 0,
    isDragging: false,
    startX: 0,
    lastX: 0,
    targetPosition: 0,
    isSnapping: false
  });

  const requestRef = useRef();

  const filteredCourses = courses.filter(course => {
    const term = searchTerm.toLowerCase().trim();
    if (!term) return true;
    return (
      course.title.toLowerCase().includes(term) || 
      course.category.toLowerCase().includes(term) ||
      (course.description && course.description.toLowerCase().includes(term))
    );
  });

  const CARD_WIDTH = 340; 
  const CARD_SPACING = 360; 
  const VISIBLE_CARDS = 7; 

  useEffect(() => {
    state.current.position = 0;
    state.current.velocity = 2; 
  }, [searchTerm]);

  const animate = () => {
    if (!containerRef.current) return;

    const s = state.current;

    if (!s.isDragging) {
      s.position += s.velocity;
      s.velocity *= 0.95; 
      
      if (Math.abs(s.velocity) < 0.1) s.velocity = 0;
    }

    const totalWidth = filteredCourses.length * CARD_SPACING;
    const centerOffset = window.innerWidth / 2;

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
        let scale = 1;
        let rotateY = 0;
        let opacity = 1;
        let blur = 0;
        let zIndex = 10;

        if (absDist < maxDist) {
          const ratio = absDist / maxDist;
          scale = 1 - (ratio * 0.25);
          rotateY = distToCenter / 20;
          opacity = 1 - (ratio * 0.5);
          blur = ratio * 4;
          zIndex = 100 - Math.round(ratio * 50);
        } else {
          scale = 0.75;
          opacity = 0.5;
          blur = 4;
          zIndex = 1;
        }

        card.style.transform = `translate3d(${cardX}px, 0, 0) perspective(1000px) rotateY(${rotateY}deg) scale(${scale})`;
        card.style.opacity = opacity;
        card.style.filter = `blur(${blur}px)`;
        card.style.zIndex = zIndex;
        card.style.borderColor = absDist < 150 ? '#F9703E' : '#627D98';
      });
    }

    requestRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef.current);
  }, [filteredCourses]);

  const handleStart = (clientX) => {
    const s = state.current;
    s.isDragging = true;
    s.startX = clientX;
    s.lastX = clientX;
    s.velocity = 0; 
  };

  const handleMove = (clientX) => {
    const s = state.current;
    if (!s.isDragging) return;
    
    const delta = clientX - s.lastX;
    s.position += delta; 
    s.lastX = clientX;
    s.velocity = delta; 
  };

  const handleEnd = () => {
    state.current.isDragging = false;
  };

  const onTouchStart = (e) => handleStart(e.touches[0].clientX);
  const onTouchMove = (e) => handleMove(e.touches[0].clientX);
  const onMouseDown = (e) => handleStart(e.clientX);
  const onMouseMove = (e) => { if(state.current.isDragging) { e.preventDefault(); handleMove(e.clientX); }};
  
  const handleCardClick = (course) => {
    if (Math.abs(state.current.velocity) > 2) return;
    handleCourseClick(course);
  };

  return (
    <div className={`pb-20 min-h-screen font-sans relative z-10 overflow-x-hidden select-none`}>
      <Navbar user={user} userData={userData} setView={setView} handleLogin={handleLogin} handleLogout={handleLogout} />
      
      {/* HERO SECTION */}
      <div className={`relative py-12 px-6 text-center overflow-hidden z-10`}>
        <div className="max-w-5xl mx-auto relative animate-fade-in-up">
          <Badge color="orange" className="mb-6 shadow-lg inline-block"><Sparkles size={14} className="inline mr-1 animate-pulse"/> CATÁLOGO PREMIUM</Badge>
          <h1 className={`text-5xl md:text-7xl font-black mb-6 tracking-tight leading-tight ${COLORS.textLight} drop-shadow-xl`}>
            Crea Activos con IA  <br/>
            <span className={`${COLORS.textOrange} inline-block`}>Monetiza desde hoy.</span>
          </h1>
          
          <div className="max-w-xl mx-auto relative group z-20 mb-8">
            <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
              <Search className={`h-6 w-6 ${COLORS.textMuted} group-focus-within:text-[#F9703E] transition-colors`} />
            </div>
            <input 
              type="text" 
              placeholder="Buscar curso..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full pl-14 pr-6 py-4 rounded-full border border-[#627D98] ${COLORS.bgCard} shadow-2xl text-lg font-bold ${COLORS.textLight} placeholder:${COLORS.textMuted} focus:outline-none focus:border-[#F9703E] focus:ring-1 focus:ring-[#F9703E] transition-all duration-300 focus:shadow-[#F9703E]/20 select-text`}
            />
          </div>
        </div>
      </div>
      
      {/* --- CARRUSEL INFINITO PHYSICS --- */}
      <div 
        ref={containerRef}
        className="relative w-full h-[600px] z-10 cursor-grab active:cursor-grabbing touch-pan-y outline-none"
        onTouchStart={onTouchStart} onTouchMove={onTouchMove} onTouchEnd={handleEnd}
        onMouseDown={onMouseDown} onMouseMove={onMouseMove} onMouseUp={handleEnd} onMouseLeave={handleEnd}
      >
        
        {loadingCourses ? (
          <div className="flex justify-center h-full items-center"><Loader className={`animate-spin ${COLORS.textOrange}`} size={50}/></div>
        ) : filteredCourses.length === 0 ? (
          <div className="text-center pt-20">
            <p className={`${COLORS.textMuted} text-xl font-bold`}>No encontramos cursos 🔍</p>
            <button onClick={() => setSearchTerm("")} className={`mt-4 ${COLORS.textOrange} font-bold underline hover:text-white transition-colors`}>Ver todos</button>
          </div>
        ) : (
          <div className="relative w-full h-full overflow-hidden">
            {filteredCourses.map((course, index) => {
               const price = Number(course.price) || 0;
               const isUnlocked = course.isFree || userData.isSubscribed || userData.purchasedCourses.includes(course.id);

               return (
                <div 
                  key={course.id}
                  ref={el => cardsRef.current[index] = el}
                  className={`absolute top-10 left-0 w-[300px] md:w-[340px] h-[500px] rounded-[2.5rem] bg-[#486581] border-2 border-[#627D98] shadow-2xl overflow-hidden flex flex-col hover:border-[#F9703E] will-change-transform`}
                  style={{ transform: 'translate3d(-1000px, 0, 0)' }} 
                >
                  <div className="relative h-64 overflow-hidden pointer-events-none">
                    <img src={course.image} alt={course.title} className="w-full h-full object-cover select-none" draggable="false" />
                    <div className="absolute top-5 left-5"><Badge color="light">{course.category}</Badge></div>
                    {!isUnlocked && (
                      <div className="absolute inset-0 flex items-center justify-center bg-[#334E68]/70 backdrop-blur-[2px]">
                        <div className={`${COLORS.bgLighter} p-4 rounded-full shadow-xl border border-[#F0F4F8]/20`}><Lock className="text-[#F0F4F8]" size={28} /></div>
                      </div>
                    )}
                  </div>

                  <div className="p-8 flex-1 flex flex-col pointer-events-none">
                    <h3 className={`text-2xl font-black ${COLORS.textLight} mb-3 leading-tight line-clamp-2`}>{course.title}</h3>
                    <p className={`${COLORS.textMuted} text-sm mb-6 line-clamp-3 font-medium`}>{course.description}</p>
                    
                    <div className="mt-auto flex justify-between items-center pt-4 border-t border-[#627D98] pointer-events-auto">
                       <span className={`text-xs font-bold ${COLORS.textMuted} flex items-center gap-2`}><CalendarCheck size={16} className={COLORS.textOrange}/> {course.duration}</span>
                       <button 
                         onClick={(e) => { e.stopPropagation(); handleCardClick(course); }} 
                         className={`${isUnlocked ? 'bg-[#48BB78]/20 text-[#48BB78]' : `${COLORS.accentOrange} text-white`} px-5 py-2.5 rounded-full font-bold text-sm shadow-md hover:scale-105 transition-transform cursor-pointer`}
                       >
                         {isUnlocked ? 'Acceder' : (price === 0 ? 'GRATIS' : `$${price.toFixed(2)}`)}
                       </button>
                    </div>
                  </div>
                </div>
               );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

// --- COMPONENTE COURSE DETAIL VIEW ---
const CourseDetailView = ({ selectedCourse, isRich, setView, user, handleLogin, handlePayment, handleLogout, resetDatabase, userData }) => {
  const [activeTab, setActiveTab] = useState(isRich ? 'plan' : 'video');
  const [expandedWeek, setExpandedWeek] = useState(null);

  return (
    <div className={`min-h-screen pb-20 font-sans ${COLORS.textLight} animate-fade-in-up overflow-x-hidden relative z-10`}>
      <Navbar user={user} userData={userData} setView={setView} handleLogin={handleLogin} handleLogout={handleLogout} resetDatabase={resetDatabase} />
      
      <div className={`relative pt-20 pb-36 px-6 border-b border-[#486581] z-10 bg-[#334E68]/80 backdrop-blur-sm`}>
        <div className="max-w-5xl mx-auto text-center relative z-10 animate-fade-in-up">
          <button onClick={() => setView('home')} className={`group flex items-center ${COLORS.textMuted} hover:text-white font-bold ${COLORS.bgCard} px-5 py-2.5 rounded-full mb-8 mx-auto transition-all border border-[#627D98] hover:border-[#F9703E] hover:-translate-x-1`}><ChevronRight size={18} className="mr-2 rotate-180" /> Volver</button>
          
          <div className="flex flex-wrap gap-3 mb-6 justify-center">
            <Badge color="light">{selectedCourse.category}</Badge>
            {isRich && <Badge color="orange"><Sparkles size={12} className="mr-1 inline-block animate-spin-slow"/> PREMIUM</Badge>}
          </div>
          
          <h1 className={`text-4xl md:text-6xl font-black mb-6 tracking-tight ${COLORS.textLight} leading-tight drop-shadow-xl`}>{selectedCourse.title}</h1>
          <p className={`${COLORS.textMuted} text-lg max-w-3xl mx-auto font-medium opacity-90 leading-relaxed`}>
            {selectedCourse.longDescription || selectedCourse.description}
          </p>
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
                  <div 
                    key={week.week} 
                    className={`group ${COLORS.bgMain} border ${expandedWeek === week.week ? 'border-[#F9703E] shadow-md' : 'border-[#486581]'} rounded-2xl overflow-hidden transition-all duration-300 animate-fade-in-up`}
                    style={{animationDelay: `${index * 0.1}s`}}
                  >
                    <div onClick={() => setExpandedWeek(expandedWeek === week.week ? null : week.week)} className={`p-6 flex items-center justify-between cursor-pointer hover:bg-[#486581]/50 transition-colors`}>
                      <div className="flex items-center gap-6">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-black text-xl transition-all ${expandedWeek === week.week ? `${COLORS.accentOrange} text-white rotate-3 scale-110` : `${COLORS.bgCard} ${COLORS.textMuted} border border-[#627D98]`}`}>{week.week}</div>
                        <div><p className={`text-[10px] ${COLORS.textOrange} uppercase font-bold tracking-widest mb-1`}>Semana {week.week}</p><h4 className={`font-bold ${COLORS.textLight} text-lg`}>{week.title}</h4></div>
                      </div>
                      <ChevronDown size={24} className={`${COLORS.textMuted} transition-transform duration-300 ${expandedWeek === week.week ? `rotate-180 ${COLORS.textOrange}` : ''}`}/>
                    </div>
                    {expandedWeek === week.week && (
                      <div className={`px-6 pb-8 pt-2 border-t border-[#486581] animate-fade-in-up`}>
                        <ul className="space-y-4">
                          {week.tasks.map((task, i) => (
                            <li key={i} className={`flex items-start gap-4 ${COLORS.textLight} text-sm font-medium`}>
                              <CheckCircle size={20} className={`${COLORS.textOrange} flex-shrink-0 mt-0.5`} />
                              <span>{task}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'syllabus' && isRich && (
              <div className="space-y-8 max-w-3xl mx-auto">
                {selectedCourse.syllabus.map((mod, i) => (
                  <div key={i} className={`${COLORS.bgMain} p-8 rounded-[2rem] border border-[#486581] shadow-lg hover:border-[#627D98] transition-all animate-fade-in-up`} style={{animationDelay: `${i * 0.1}s`}}>
                    <h3 className={`font-bold text-xl ${COLORS.textLight} mb-6 flex items-center gap-4`}><span className={`${COLORS.accentOrange} text-white w-10 h-10 rounded-xl flex items-center justify-center text-base font-black shadow-sm`}>{i+1}</span>{mod.title}</h3>
                    <div className={`space-y-6 pl-5 border-l-2 border-[#627D98] ml-5`}>
                      {mod.content.map((item, j) => (
                        <div key={j} className="relative pl-6">
                          <div className={`absolute left-[-0.4rem] top-1.5 w-3 h-3 rounded-full ${COLORS.accentOrange}`}></div>
                          <h5 className={`font-bold ${COLORS.textLight} text-lg mb-2`}>{item.subtitle}</h5>
                          <p className={`${COLORS.textMuted} leading-relaxed text-sm ${COLORS.bgCard} p-4 rounded-xl border border-[#486581]`}>{item.text}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'tools' && isRich && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                {selectedCourse.tools.map((tool, i) => (
                  <a key={i} href={tool.link} target="_blank" rel="noopener noreferrer" className={`${COLORS.bgMain} p-6 rounded-2xl border border-[#486581] hover:border-[#F9703E] transition-all duration-300 group flex items-start gap-5 hover:-translate-y-2 shadow-md hover:shadow-2xl animate-fade-in-up`} style={{animationDelay: `${i * 0.1}s`}}>
                    <div className={`${COLORS.bgCard} p-4 rounded-xl group-hover:${COLORS.accentOrange} transition-colors border border-[#627D98] duration-300`}>
                       <PenTool size={24} className={`${COLORS.textMuted} group-hover:text-white transition-colors`}/>
                    </div>
                    <div>
                      <h4 className={`font-bold ${COLORS.textLight} text-lg flex items-center gap-2 mb-2 group-hover:${COLORS.textOrange} transition-colors`}>{tool.name} <ExternalLink size={16} className="opacity-50"/></h4>
                      <p className={`${COLORS.textMuted} text-sm`}>{tool.desc}</p>
                    </div>
                  </a>
                ))}
              </div>
            )}

            {(!isRich || activeTab === 'video') && (
               <div className="flex flex-col items-center justify-center text-center h-full py-24 animate-fade-in-up">
                  <div className={`${COLORS.bgMain} p-10 rounded-full mb-8 text-[#627D98] border border-[#486581] animate-float`}><Video size={60}/></div>
                  <h3 className={`font-bold text-2xl ${COLORS.textLight} mb-3`}>Video Introductorio</h3>
                  <p className={COLORS.textMuted}>Contenido próximamente.</p>
               </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// --- APP PRINCIPAL ---
export default function App() {
  const [view, setView] = useState('home'); 
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentType, setPaymentType] = useState(null); 
  const [notification, setNotification] = useState(null);
  const [isLoadingPayment, setIsLoadingPayment] = useState(false);

  const [courses, setCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState(""); 
  const [loadingCourses, setLoadingCourses] = useState(true);
  const [user, setUser] = useState(null); 
  const [userData, setUserData] = useState({ purchasedCourses: [], isSubscribed: false });

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "courses"));
        setCourses(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (error) {
        console.error("Error courses:", error);
      } finally {
        setLoadingCourses(false);
      }
    };
    fetchCourses();
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const userDocRef = doc(db, "users", currentUser.uid);
        onSnapshot(userDocRef, (docSnap) => {
          if (docSnap.exists()) setUserData(docSnap.data());
          else setDoc(userDocRef, { email: currentUser.email, purchasedCourses: [], isSubscribed: false }, { merge: true });
        });
      } else {
        setUserData({ purchasedCourses: [], isSubscribed: false });
      }
    });
    return () => unsubscribe();
  }, []);

  const resetDatabase = async () => {
    if (!confirm("⚠️ ¡PELIGRO! Esto borrará TODOS los cursos actuales y subirá limpios los 15 nuevos. ¿Continuar?")) return;
    try {
      showNotification("Limpiando base de datos...", "warning");
      const querySnapshot = await getDocs(collection(db, "courses"));
      const batchDelete = writeBatch(db);
      querySnapshot.forEach((doc) => batchDelete.delete(doc.ref));
      await batchDelete.commit();

      showNotification("Subiendo 15 cursos nuevos...", "warning");
      const batchUpload = writeBatch(db);
      ALL_COURSES.forEach((courseData) => {
        const newDocRef = doc(collection(db, "courses")); 
        batchUpload.set(newDocRef, courseData);
      });
      await batchUpload.commit();
      
      showNotification("¡Base de datos REINICIADA correctamente! Recargando...", "success");
      setTimeout(() => window.location.reload(), 2000);
    } catch (e) {
      console.error(e);
      showNotification("Error en el proceso.", "error");
    }
  };

  const handleLogin = async () => {
    try { await signInWithPopup(auth, googleProvider); showNotification("¡Bienvenido!", "success"); } 
    catch (error) { showNotification("Error login", "error"); }
  };

  const handleLogout = async () => { await signOut(auth); setView('home'); };

  const showNotification = (msg, type = 'success') => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 4000);
  };

  const handleCourseClick = (course) => {
    const isUnlocked = course.isFree || userData.isSubscribed || userData.purchasedCourses.includes(course.id);
    if (isUnlocked) {
      setSelectedCourse(course);
      setView('course-detail');
      window.scrollTo(0, 0);
    } else {
      if (!user) { showNotification("Inicia sesión primero", "error"); handleLogin(); return; }
      setSelectedCourse(course);
      setPaymentType('single');
      setShowPaymentModal(true);
    }
  };

  const handlePayment = async (type) => {
    setIsLoadingPayment(true);
    setTimeout(async () => {
      const userRef = doc(db, "users", user.uid);
      if (confirm("Simulando pago...")) {
        if (type === 'subscription') await updateDoc(userRef, { isSubscribed: true });
        else await updateDoc(userRef, { purchasedCourses: arrayUnion(selectedCourse.id) });
        showNotification("¡Pago Exitoso!", "success");
        setShowPaymentModal(false);
      }
      setIsLoadingPayment(false);
    }, 2000);
  };

  return (
    <div className={`font-sans ${COLORS.textLight} ${COLORS.bgMain} min-h-screen selection:bg-[#F9703E] selection:text-white relative`}>
      {/* FONDO NEURONAL ANIMADO */}
      <NeuralBackground />

      {notification && <div className={`fixed top-8 left-1/2 transform -translate-x-1/2 z-[100] px-8 py-4 rounded-full shadow-2xl flex items-center gap-4 animate-pop-in ${COLORS.bgCard} border border-[#627D98] ${notification.type === 'error' ? 'text-red-400' : COLORS.textOrange} text-base font-bold`}><CheckCircle size={24} /> {notification.msg}</div>}
      
      {view === 'home' && (
        <HomeView 
          courses={courses} 
          loadingCourses={loadingCourses} 
          userData={userData} 
          user={user}
          handleCourseClick={handleCourseClick}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          setView={setView}
          handleLogin={handleLogin}
          handleLogout={handleLogout}
          resetDatabase={resetDatabase}
        />
      )}
      
      {view === 'course-detail' && (
        <CourseDetailView 
          selectedCourse={selectedCourse}
          isRich={selectedCourse?.isRichContent}
          setView={setView}
          user={user}
          handleLogin={handleLogin}
          handlePayment={handlePayment}
          handleLogout={handleLogout}
          resetDatabase={resetDatabase}
          userData={userData}
        />
      )}

      {/* MODAL DE PAGO */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#102A43]/80 backdrop-blur-sm animate-fade-in-up">
          <div className={`${COLORS.bgCard} rounded-[2rem] shadow-2xl max-w-md w-full p-8 text-center relative overflow-hidden border border-[#627D98] animate-pop-in`}>
            <div className={`absolute top-0 left-0 w-full h-2 ${COLORS.accentOrange}`}></div>
            <h3 className={`text-3xl font-black mb-4 ${COLORS.textLight} leading-tight`}>Desbloquea tu Potencial</h3>
            <p className={`${COLORS.textMuted} mb-8 font-medium text-sm`}>Acceso vitalicio a este curso.</p>
            <div className={`${COLORS.bgMain} p-6 rounded-2xl mb-8 border border-[#486581]`}>
              <p className={`text-[10px] ${COLORS.textOrange} font-bold uppercase tracking-widest mb-2`}>Inversión Única</p>
              <p className={`text-5xl font-black ${COLORS.textLight}`}>$2.00</p>
            </div>
            <Button onClick={() => handlePayment(paymentType)} variant="primary" className="w-full h-16 text-xl shadow-lg hover:scale-105 transition-transform">
              {isLoadingPayment ? <Loader className="animate-spin"/> : "Confirmar y Empezar"}
            </Button>
            <button onClick={() => setShowPaymentModal(false)} className={`w-full mt-6 text-sm font-bold ${COLORS.textMuted} hover:text-white transition-colors uppercase tracking-wider`}>Cancelar</button>
          </div>
        </div>
      )}
    </div>
  );
}