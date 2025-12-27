// src/components/NewsBubble.jsx
import React, { useState, useEffect } from 'react';
import { Bot, X, ChevronRight, MessageCircle } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom'; // Importamos useLocation
import { COLORS } from '../utils/constants';

const NewsBubble = ({ news = [] }) => {
  const navigate = useNavigate();
  const location = useLocation(); // Detecta en qué página estamos
  
  const [showNotification, setShowNotification] = useState(false);
  const [featuredNews, setFeaturedNews] = useState(null);

  // --- EFECTO INTELIGENTE: Cambiar noticia al volver al Inicio ---
  useEffect(() => {
    // Solo activamos el globo si estamos en el INICIO ('/') y hay noticias cargadas
    if (location.pathname === '/' && news.length > 0) {
        
        // 1. Elegimos una noticia NUEVA al azar (de las primeras 8 para variedad)
        const randomIndex = Math.floor(Math.random() * Math.min(news.length, 8));
        setFeaturedNews(news[randomIndex]);

        // 2. Reseteamos la notificación para que haga la animación de entrada de nuevo
        setShowNotification(false);
        
        // 3. Mostramos el globo tras 1.5 segundos de haber entrado al Home
        const timerShow = setTimeout(() => {
            setShowNotification(true);
        }, 1500);

        // 4. Lo ocultamos automáticamente a los 10 segundos para no molestar
        const timerHide = setTimeout(() => {
            setShowNotification(false);
        }, 10000);

        return () => {
            clearTimeout(timerShow);
            clearTimeout(timerHide);
        };
    } else {
        // Si el usuario se va a otra página (ej: /perfil), ocultamos el globo automáticamente
        setShowNotification(false);
    }
  }, [location.pathname, news]); // Se ejecuta cada vez que cambia la ruta o las noticias

  // Función para ir directo a la pantalla de noticias
  const handleGoToNews = () => {
    navigate('/noticias');
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end animate-fade-in-up">
      
      {/* --- NOTIFICACIÓN LATERAL (Globo con noticia aleatoria) --- */}
      {showNotification && featuredNews && (
        <div className="absolute bottom-20 right-0 mb-2 mr-2 w-72 animate-slide-in-right z-40">
          <div className={`${COLORS.bgCard} border border-[#F9703E] p-4 rounded-tl-2xl rounded-tr-2xl rounded-bl-2xl shadow-2xl relative`}>
            
            {/* Triángulo decorativo del globo */}
            <div className={`absolute -bottom-2 right-4 w-4 h-4 ${COLORS.bgCard} border-b border-r border-[#F9703E] transform rotate-45`}></div>
            
            {/* Botón cerrar (solo cierra el globo) */}
            <button 
              onClick={(e) => {
                e.stopPropagation(); 
                setShowNotification(false);
              }}
              className="absolute -top-2 -left-2 bg-[#F9703E] text-white rounded-full p-1 hover:scale-110 transition-transform shadow-md z-50"
            >
              <X size={12} />
            </button>

            {/* Contenido Clicable -> Va a /noticias */}
            <div onClick={handleGoToNews} className="cursor-pointer group">
                <div className="flex items-center gap-2 mb-2">
                   <MessageCircle size={16} className="text-[#F9703E]" />
                   <span className="text-[10px] font-bold text-[#BCCCDC] uppercase tracking-wider">
                     {featuredNews.source || 'Noticia Flash'}
                   </span>
                </div>

                {/* Titular Completo (Sin cortes) */}
                <h4 className="text-white font-bold text-sm leading-snug mb-2 group-hover:text-[#F9703E] transition-colors">
                  {featuredNews.title}
                </h4>
                
                <button 
                  className="w-full py-1.5 bg-[#334E68] group-hover:bg-[#F9703E] text-white text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1 mt-2"
                >
                  Leer en Noticias <ChevronRight size={12} />
                </button>
            </div>
          </div>
        </div>
      )}

      {/* --- BOTÓN FLOTANTE (Click -> /noticias) --- */}
      <button
        onClick={handleGoToNews}
        className={`p-4 rounded-full shadow-2xl transition-all duration-300 flex items-center justify-center border-2 z-50 ${COLORS.accentOrange} text-white border-white/20 hover:scale-110 hover:shadow-[#F9703E]/50 active:scale-95`}
      >
        <Bot size={28} />
        
        {/* Puntito rojo si el globo está oculto */}
        {!showNotification && (
          <span className="absolute top-0 right-0 flex h-3 w-3 -mt-1 -mr-1">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500 border-2 border-[#102A43]"></span>
          </span>
        )}
      </button>
    </div>
  );
};

export default NewsBubble;