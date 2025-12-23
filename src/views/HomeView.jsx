// src/views/HomeView.jsx
import React, { useEffect, useRef } from 'react';
import { Sparkles, Search, Loader, Lock, CalendarCheck, Crown } from 'lucide-react';
import Navbar from '../components/Navbar';
import ToolsSection from '../components/ToolsSection'; // Componente de herramientas
import { Badge } from '../components/UI';
import { COLORS, formatCurrency, ORIGINAL_PRICE, COURSE_PRICE } from '../utils/constants';

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
      <Navbar 
        user={user} 
        userData={userData} 
        setView={setView} 
        onNavigate={onNavigate} 
        handleLogin={handleLogin} 
        handleLogout={handleLogout} 
      />
      
      {/* HEADER HERO */}
      <div className={`relative pt-12 pb-4 px-6 text-center overflow-hidden z-10`}>
        <div className="max-w-5xl mx-auto relative animate-fade-in-up">
          
          {userData?.isSubscribed ? (
            <Badge color="orange" className="mb-6 shadow-lg inline-block">
               <Crown size={14} className="inline mr-1 animate-pulse"/> MIEMBRO PREMIUM
            </Badge>
          ) : (
            <button 
              onClick={() => onNavigate('subscription')} 
              className="mb-6 hover:scale-105 transition-transform active:scale-95 group"
            >
              <Badge color="orange" className="shadow-lg inline-flex items-center gap-1 cursor-pointer group-hover:bg-[#F9703E]/30 transition-colors">
                <Sparkles size={14} className="animate-pulse"/> SUSCRÍBETE Y ACCEDE A TODO
              </Badge>
            </button>
          )}

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

        </div>
      </div>
      
      {/* BARRA DE BÚSQUEDA */}
      <div className="relative z-30 px-6 mb-12 animate-fade-in-up -mt-6" style={{animationDelay: '1s', animationFillMode: 'forwards', opacity: 0}}>
        <div className="max-w-xl mx-auto relative group">
          <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none"><Search className={`h-6 w-6 ${COLORS.textMuted} group-focus-within:text-[#F9703E] transition-colors`} /></div>
          <input type="text" placeholder="Buscar (ej: YouTube, Dinero, Web...)" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className={`w-full pl-14 pr-6 py-4 rounded-full border border-[#627D98] ${COLORS.bgCard} shadow-2xl text-lg font-bold ${COLORS.textLight} placeholder:${COLORS.textMuted} focus:outline-none focus:border-[#F9703E] focus:ring-1 focus:ring-[#F9703E] transition-all duration-300 focus:shadow-[#F9703E]/20 select-text`}/>
        </div>
      </div>
      
      {/* CARRUSEL 3D */}
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

      {/* AQUÍ ESTÁ EL CAMBIO: Pasamos onNavigate a la sección de herramientas */}
      <ToolsSection onNavigate={onNavigate} />
      
    </div>
  );
};

export default HomeView;