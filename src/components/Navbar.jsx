// src/components/Navbar.jsx
import React from 'react';
import { User, Crown, ChevronRight, Bell } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { COLORS } from '../utils/constants';
import { Button } from './UI';

const Navbar = ({ user, userData, handleLogin }) => {
  const navigate = useNavigate();

  return (
    <nav className={`sticky top-0 z-50 bg-[#334E68]/80 border-b border-[#486581] py-3 shadow-2xl animate-slide-down backdrop-blur-md bg-opacity-95 select-none will-change-transform`}>
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center h-16">
        
        {/* LOGO (Clic para ir al Home) */}
        <div className="flex items-center gap-3 cursor-pointer group" onClick={() => navigate('/')}>
          <img src="/logo.png" alt="Logo" className="w-11 h-11 object-contain group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 drop-shadow-md" />
          <span className={`font-black text-2xl ${COLORS.textLight} tracking-tight`}>
            haeric <span className={`${COLORS.textOrange} group-hover:text-white transition-colors duration-300`}>Activos</span>
          </span>
        </div>

        {/* --- NUEVO: BOTÓN DE NOTICIAS (CENTRAL) --- */}
        <div className="hidden md:flex items-center">
           <button 
             onClick={() => navigate('/noticias')}
             className={`flex items-center gap-2 font-bold text-sm ${COLORS.textMuted} hover:text-[#F9703E] transition-colors py-2 px-4 rounded-full hover:bg-[#102A43]/50 active:scale-95`}
           >
             <Bell size={18} className="animate-swing text-[#F9703E]" /> Novedades IA
           </button>
        </div>

        {/* ÁREA DE USUARIO */}
        <div className="flex items-center gap-4">
          {user ? (
            <button 
              onClick={() => navigate('/perfil')} 
              className={`flex items-center gap-3 ${COLORS.bgCard} pl-2 pr-4 py-1.5 rounded-full border border-[#627D98] shadow-inner transition-all hover:border-[#F9703E] group hover:scale-105 active:scale-95 cursor-pointer`}
            >
              <img src={user.photoURL} className={`w-8 h-8 rounded-full border-2 border-[#F9703E] group-hover:shadow-lg transition-shadow`} alt="user" />
              <div className="flex flex-col items-start">
                  <span className="text-xs font-bold text-white leading-none mb-0.5 max-w-[80px] truncate">{user.displayName?.split(' ')[0]}</span>
                  {userData?.isSubscribed ? (
                      <span className="text-[9px] font-black text-[#F9703E] flex items-center gap-0.5"><Crown size={8}/> PRO</span>
                  ) : (
                      <span className="text-[9px] font-bold text-[#BCCCDC]">Ver Perfil</span>
                  )}
              </div>
              <ChevronRight size={14} className="text-[#627D98] group-hover:text-white transition-colors"/>
            </button>
          ) : (
            <Button onClick={handleLogin} variant="google" className="text-sm font-bold rounded-full px-6 shadow-sm"><User size={18} className="text-[#334E68]"/> Entrar</Button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;