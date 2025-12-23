// src/views/NewsView.jsx
import React from 'react';
import { ChevronRight, Bell } from 'lucide-react';
import Navbar from '../components/Navbar';
import NewsSection from '../components/NewsSection';
import { COLORS } from '../utils/constants';

// Agregamos el prop 'news' aquí
const NewsView = ({ user, userData, setView, onNavigate, handleLogin, handleLogout, news }) => {
  return (
    <div className={`min-h-screen pb-20 font-sans ${COLORS.textLight} animate-fade-in-up overflow-x-hidden relative z-10`}>
      <Navbar user={user} userData={userData} setView={setView} onNavigate={onNavigate} handleLogin={handleLogin} handleLogout={handleLogout} />
      
      <div className={`relative pt-10 pb-6 px-6 border-b border-[#486581] z-10 bg-[#334E68]/95 backdrop-blur-sm shadow-sm`}>
        <div className="max-w-4xl mx-auto text-center relative z-10 animate-fade-in-up">
           <button onClick={() => onNavigate('home')} className={`group inline-flex items-center ${COLORS.textMuted} hover:text-white font-bold ${COLORS.bgCard} px-3 py-1.5 rounded-full mb-2 mx-auto transition-all border border-[#627D98] hover:border-[#F9703E] hover:-translate-x-1 text-[10px] uppercase tracking-wider`}><ChevronRight size={12} className="mr-1 rotate-180" /> Volver al Inicio</button>
           <h1 className={`text-3xl font-black mb-1 tracking-tight ${COLORS.textLight} flex items-center justify-center gap-3`}>
             <Bell className="text-[#F9703E] animate-swing" /> Novedades
           </h1>
           <p className={`${COLORS.textMuted} text-sm max-w-xl mx-auto font-medium opacity-80`}>Mantente al día con las últimas tendencias de IA.</p>
        </div>
      </div>

      <div className="pt-0">
         {/* Pasamos 'news' al componente final */}
         <NewsSection news={news} />
      </div>
    </div>
  );
};

export default NewsView;