// src/components/SubscriptionBanner.jsx
import React from 'react';
import { CheckCircle, Zap, Star, Timer, TrendingDown } from 'lucide-react';
import { PayPalButtons } from "@paypal/react-paypal-js";
import { 
  PLAN_MONTHLY_PRICE, PLAN_YEARLY_PRICE, 
  ORIGINAL_MONTHLY_PRICE, ORIGINAL_YEARLY_PRICE, // Importamos los precios originales
  formatCurrency 
} from '../utils/constants';

// IDs DE PLANES DE PAYPAL
const PAYPAL_PLAN_MONTHLY_ID = "P-5X729325VU782483PNFDX2WY"; 
const PAYPAL_PLAN_YEARLY_ID = "P-04Y821593A494293XNFJVYAA"; 

const SubscriptionBanner = ({ onPayPalApprove, isSubscribed, user, handleLogin }) => {

  if (isSubscribed) {
    return (
      <div className="max-w-4xl mx-auto text-center p-12 bg-[#102A43]/80 rounded-3xl border border-[#48BB78] animate-fade-in">
         <CheckCircle size={48} className="text-[#48BB78] mx-auto mb-4" />
         <h2 className="text-3xl font-black text-white mb-4">¡Ya eres miembro Premium!</h2>
         <p className="text-[#BCCCDC]">Tu cuenta está activa y tienes acceso total.</p>
      </div>
    );
  }

  // Estilos base
  const cardBase = "relative flex flex-col p-8 rounded-[2rem] border transition-all duration-500 backdrop-blur-md group";
  const featureItem = "flex items-center gap-3 text-sm text-[#BCCCDC] font-medium mb-3";

  // Cálculo de ahorro aproximado para visualización
  const monthlySavings = Math.round(((ORIGINAL_MONTHLY_PRICE - PLAN_MONTHLY_PRICE) / ORIGINAL_MONTHLY_PRICE) * 100);
  const yearlySavings = Math.round(((ORIGINAL_YEARLY_PRICE - PLAN_YEARLY_PRICE) / ORIGINAL_YEARLY_PRICE) * 100);

  return (
    <div className="w-full max-w-6xl mx-auto relative z-20 pb-20">
      
      {/* Encabezado de la sección de Oferta */}
      <div className="text-center mb-12 animate-fade-in-up">
        <div className="inline-flex items-center gap-2 bg-[#F9703E]/20 text-[#F9703E] px-4 py-2 rounded-full font-bold text-sm mb-4 animate-pulse">
            <Timer size={16} /> OFERTA POR TIEMPO LIMITADO
        </div>
        <h2 className="text-3xl md:text-4xl font-black text-white mb-4">
          Precios de <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F9703E] to-[#FFC439]">Lanzamiento</span>
        </h2>
        <p className="text-[#BCCCDC] max-w-xl mx-auto">
          Aprovecha estos descuentos irrepetibles antes de que volvamos a los precios normales.
        </p>
      </div>

      {/* Grid de 2 Columnas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">

        {/* --- PLAN MENSUAL (Colores Azules) --- */}
        <div className={`${cardBase} bg-[#102A43]/60 border-[#009EE3]/30 hover:border-[#009EE3] hover:shadow-xl hover:shadow-[#009EE3]/20 animate-fade-in-up delay-100`}>
          
          <div className="mb-6">
            <div className="flex justify-between items-start">
                <h3 className="text-xl font-bold text-[#F0F4F8] uppercase tracking-wider mb-2">Mensual</h3>
                {/* Badge de Descuento */}
                <div className="bg-[#009EE3]/20 text-[#009EE3] text-xs font-black px-3 py-1 rounded-full flex items-center gap-1 animate-bounce-slow">
                    <TrendingDown size={12} /> AHORRAS {monthlySavings}%
                </div>
            </div>

            {/* Bloque de Precio */}
            <div className="flex flex-col mt-4 group-hover:scale-105 transition-transform duration-300 origin-left">
              {/* Precio Original Tachado */}
              <span className="text-[#829AB1] line-through text-sm font-medium">
                  Normal: {formatCurrency(ORIGINAL_MONTHLY_PRICE)}
              </span>
              {/* Precio Nuevo */}
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-black text-white tracking-tight drop-shadow-sm">
                    {formatCurrency(PLAN_MONTHLY_PRICE)}
                </span>
                <span className="text-[#829AB1] font-bold">/mes</span>
              </div>
            </div>
            <p className="text-[#009EE3] text-xs mt-3 font-bold">Flexibilidad total. Cancela cuando quieras.</p>
          </div>

          {/* Lista de Beneficios */}
          <div className="mb-8 flex-grow">
            <div className={featureItem}><CheckCircle size={18} className="text-[#009EE3]" /> Acceso total inmediato</div>
            <div className={featureItem}><CheckCircle size={18} className="text-[#009EE3]" /> Sin compromisos a largo plazo</div>
          </div>

          {/* Botón de PayPal Azul */}
          <div className="relative z-10 w-full">
            {!user ? (
               <button onClick={handleLogin} className="w-full py-3 rounded-full bg-[#009EE3]/20 text-[#009EE3] border border-[#009EE3] font-bold hover:bg-[#009EE3] hover:text-white transition-all">Iniciar sesión para aprovechar</button>
            ) : (
               <PayPalButtons 
                  key="monthly-btn-promo"
                  style={{ layout: "horizontal", color: "blue", label: "subscribe", height: 50, tagline: false }} 
                  createSubscription={(data, actions) => actions.subscription.create({ 'plan_id': PAYPAL_PLAN_MONTHLY_ID })}
                  onApprove={(data) => onPayPalApprove(data, 'monthly')}
               />
            )}
          </div>
        </div>

        {/* --- PLAN ANUAL (DESTACADO - Colores Dorados/Naranjas) --- */}
        <div className={`${cardBase} bg-gradient-to-b from-[#102A43] to-[#102A43]/90 border-[#FFC439] shadow-2xl shadow-[#FFC439]/10 transform md:-translate-y-6 hover:scale-[1.02] z-30 animate-fade-in-up`}>
          
          {/* Badge Superior de Oferta */}
          <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-[#FFC439] to-[#F9703E] text-[#102A43] text-sm font-black px-6 py-2 rounded-full shadow-lg flex items-center gap-2 animate-pulse">
            <Star size={16} fill="currentColor" /> ¡MEJOR OFERTA: {yearlySavings}% OFF!
          </div>

          <div className="mb-6 mt-8">
            <h3 className="text-2xl font-bold text-[#FFC439] uppercase tracking-wider mb-2">Anual <span className="text-white text-sm opacity-60 normal-case tracking-normal">(Plan Recomendado)</span></h3>

            {/* Bloque de Precio */}
             <div className="flex flex-col mt-4 group-hover:scale-105 transition-transform duration-300 origin-left">
                 {/* Precio Original Tachado */}
                <span className="text-[#829AB1] line-through text-sm font-medium">
                    Normal: {formatCurrency(ORIGINAL_YEARLY_PRICE)}
                </span>
                {/* Precio Nuevo */}
                <div className="flex items-baseline gap-1">
                  <span className="text-5xl md:text-6xl font-black text-white tracking-tight drop-shadow-md">
                      {formatCurrency(PLAN_YEARLY_PRICE)}
                  </span>
                  <span className="text-[#829AB1] font-bold">/año</span>
                </div>
            </div>
             
             <p className="text-[#FFC439] text-sm font-bold mt-4 bg-[#FFC439]/10 inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[#FFC439]/30">
                 <Zap size={14} fill="currentColor" /> ¡Equivale a solo {(PLAN_YEARLY_PRICE / 12).toFixed(2)}/mes!
             </p>
          </div>

          <div className="mb-8 flex-grow">
             <div className={featureItem}><CheckCircle size={20} className="text-[#FFC439]" /> <span className="text-white font-bold">Todo lo del plan mensual</span></div>
             <div className={featureItem}><CheckCircle size={20} className="text-[#FFC439]" /> Precio congelado por 1 año entero</div>
             <div className={featureItem}><CheckCircle size={20} className="text-[#FFC439]" /> Soporte prioritario</div>
          </div>

          {/* Botón de PayPal Dorado */}
          <div className="relative z-10 w-full">
            {!user ? (
               <button onClick={handleLogin} className="w-full py-4 rounded-full bg-gradient-to-r from-[#FFC439] to-[#F9703E] text-[#102A43] font-black shadow-lg text-lg hover:shadow-[#FFC439]/50 hover:scale-105 transition-all">¡QUIERO ESTA OFERTA!</button>
            ) : (
               <div className="p-1 bg-gradient-to-r from-[#FFC439]/30 to-[#F9703E]/30 rounded-xl">
                 <PayPalButtons 
                    key="yearly-btn-promo"
                    style={{ layout: "horizontal", color: "gold", label: "subscribe", height: 55, tagline: false }} 
                    createSubscription={(data, actions) => actions.subscription.create({ 'plan_id': PAYPAL_PLAN_YEARLY_ID })}
                    onApprove={(data) => onPayPalApprove(data, 'yearly')}
                 />
               </div>
            )}
            <div className="text-center mt-4 flex items-center justify-center gap-2 text-[#BCCCDC] text-xs font-medium">
                <Timer size={14} className="text-[#FFC439] animate-spin-slow" /> La oferta puede terminar en cualquier momento.
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default SubscriptionBanner;