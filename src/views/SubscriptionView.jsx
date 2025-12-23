// src/views/SubscriptionView.jsx
import React from 'react';
import { ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import SubscriptionBanner from '../components/SubscriptionBanner';
import { COLORS } from '../utils/constants';

const SubscriptionView = ({ onSubscribe, isSubscribed, user, handleLogin, handleLogout, userData }) => {
  const navigate = useNavigate();
  return (
    <div className={`min-h-screen pb-20 font-sans ${COLORS.textLight} animate-fade-in-up overflow-x-hidden relative z-10`}>
      <Navbar user={user} userData={userData} handleLogin={handleLogin} handleLogout={handleLogout} />
      <div className={`relative pt-10 pb-6 px-6 border-b border-[#486581] z-10 bg-[#334E68]/95 backdrop-blur-sm shadow-sm`}>
        <div className="max-w-4xl mx-auto text-center relative z-10 animate-fade-in-up">
           <button onClick={() => navigate(-1)} className={`group inline-flex items-center ${COLORS.textMuted} hover:text-white font-bold ${COLORS.bgCard} px-3 py-1.5 rounded-full mb-2 mx-auto transition-all border border-[#627D98] hover:border-[#F9703E] hover:-translate-x-1 text-[10px] uppercase tracking-wider`}><ChevronRight size={12} className="mr-1 rotate-180" /> Volver</button>
           <h1 className={`text-2xl md:text-3xl font-black mb-1 tracking-tight ${COLORS.textLight} leading-tight`}>Membresía <span className={COLORS.textOrange}>Premium</span></h1>
           <p className={`${COLORS.textMuted} text-xs md:text-sm max-w-xl mx-auto font-medium opacity-80`}>Accede a todos los cursos y acelera tu crecimiento.</p>
        </div>
      </div>
      <div className="pt-6"><SubscriptionBanner onSubscribe={onSubscribe} isSubscribed={isSubscribed} /></div>
    </div>
  );
};
export default SubscriptionView;