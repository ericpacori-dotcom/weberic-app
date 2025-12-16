import React from 'react';
import { Sparkles, CheckCircle, Zap, Star } from 'lucide-react';

const SubscriptionBanner = ({ onSubscribe, isSubscribed }) => {
  if (isSubscribed) return null; // Si ya es premium, no mostramos esto

  return (
    <div className="w-full max-w-7xl mx-auto px-6 mb-20 relative z-20">
      {/* Contenedor con degradado Premium */}
      <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-r from-[#102A43] via-[#243B53] to-[#102A43] border border-[#F9703E]/50 shadow-2xl group">
        
        {/* Efectos de fondo */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#F9703E] opacity-10 blur-[100px] rounded-full group-hover:opacity-20 transition-opacity duration-700"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#48BB78] opacity-10 blur-[100px] rounded-full"></div>

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between p-8 md:p-12 gap-8">
          
          {/* Lado Izquierdo: Textos */}
          <div className="text-left flex-1">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#F9703E]/20 border border-[#F9703E]/50 text-[#F9703E] font-bold text-xs uppercase tracking-widest mb-4 animate-pulse">
              <Star size={12} fill="currentColor" /> Oferta Limitada
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-[#F0F4F8] mb-4 leading-tight">
              Desbloquea <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F9703E] to-[#FFD700]">TODO</span> el contenido.
            </h2>
            <p className="text-[#BCCCDC] text-lg mb-6 max-w-xl">
              Accede a los 15 cursos actuales y futuros, herramientas exclusivas y soporte prioritario con una única suscripción mensual.
            </p>
            
            {/* Lista de Beneficios */}
            <div className="flex flex-wrap gap-4 text-sm font-bold text-[#F0F4F8]">
              <div className="flex items-center gap-2"><CheckCircle size={16} className="text-[#48BB78]" /> Acceso Total</div>
              <div className="flex items-center gap-2"><CheckCircle size={16} className="text-[#48BB78]" /> Sin Publicidad</div>
              <div className="flex items-center gap-2"><CheckCircle size={16} className="text-[#48BB78]" /> Cancela cuando quieras</div>
            </div>
          </div>

          {/* Lado Derecho: Tarjeta de Precio y Botón */}
          <div className="flex-shrink-0 w-full md:w-auto bg-[#102A43]/50 backdrop-blur-md p-6 rounded-3xl border border-[#486581] text-center transform group-hover:scale-105 transition-transform duration-500">
            <p className="text-[#BCCCDC] text-sm font-bold uppercase mb-1 line-through opacity-70">Precio Normal $15.00</p>
            <div className="flex items-center justify-center gap-1 mb-2">
              <span className="text-5xl font-black text-[#F0F4F8]">$3.00</span>
              <span className="text-[#F9703E] font-bold text-xl self-end mb-1">/mes</span>
            </div>
            <p className="text-xs text-[#48BB78] font-bold mb-6">Ahorras un 80% hoy</p>
            
            <button 
              onClick={onSubscribe}
              className="w-full py-4 px-8 rounded-full bg-gradient-to-r from-[#F9703E] to-[#D64515] text-white font-black text-lg shadow-lg hover:shadow-[#F9703E]/40 hover:-translate-y-1 transition-all flex items-center justify-center gap-2"
            >
              <Zap size={20} fill="currentColor" />
              ACTIVAR PREMIUM
            </button>
            <p className="text-[10px] text-[#BCCCDC] mt-3">Pago seguro vía Mercado Pago</p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default SubscriptionBanner;