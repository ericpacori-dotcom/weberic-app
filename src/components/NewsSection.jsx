// src/components/NewsSection.jsx
import React, { useState } from 'react';
import { Calendar, Tag, ExternalLink, Newspaper } from 'lucide-react';
import { COLORS } from '../utils/constants';

// --- Sub-componente para cada tarjeta (Maneja su propio estado de error de imagen) ---
const NewsCard = ({ item }) => {
    const [imgError, setImgError] = useState(false);

    return (
        <article 
          className={`${COLORS.bgCard} rounded-[2rem] border border-[#486581] overflow-hidden hover:border-[#F9703E] transition-all duration-300 group hover:-translate-y-1 shadow-lg flex flex-col h-full`}
        >
          {/* Zona de Imagen / Icono */}
          <div className="h-32 overflow-hidden relative bg-[#102A43]/50 flex items-center justify-center p-6 border-b border-[#486581]/50">
            
            {/* LÓGICA ROBUSTA DE IMAGEN:
                Muestra la imagen SOLO si existe la URL Y no ha dado error al cargar.
                Si no, muestra el icono de respaldo.
            */}
            {!imgError && item.image ? (
                <img 
                  src={item.image} 
                  alt={item.source} 
                  className="w-16 h-16 object-contain filter drop-shadow-lg group-hover:scale-110 transition-transform duration-500" 
                  onError={() => setImgError(true)} // Si falla, activamos el estado de error
                />
            ) : (
                // Icono de respaldo si falla el logo
                <Newspaper size={40} className="text-[#627D98] opacity-50" />
            )}
            
            {/* Etiqueta de la Fuente */}
            <div className="absolute top-3 left-3">
              <span className={`${COLORS.bgMain} text-[#F9703E] text-[9px] font-bold px-2 py-0.5 rounded-full border border-[#F9703E] flex items-center gap-1 shadow-sm uppercase tracking-wider truncate max-w-[120px]`}>
                <Tag size={8} /> {item.source}
              </span>
            </div>
          </div>
          
          {/* Contenido de texto */}
          <div className="p-6 flex-1 flex flex-col">
            <div className="flex items-center gap-2 text-[#BCCCDC] text-xs font-bold mb-3">
              <Calendar size={12} className="text-[#F9703E]" />
              <span>{item.date}</span>
            </div>
            
            <h3 className={`text-lg font-black ${COLORS.textLight} mb-3 leading-tight group-hover:text-[#F9703E] transition-colors line-clamp-3`}>
              {item.title}
            </h3>
            
            <p className={`${COLORS.textMuted} text-xs line-clamp-3 mb-4 leading-relaxed opacity-80`}>
              {item.description}
            </p>
            
            <a 
              href={item.link} 
              target="_blank" 
              rel="noopener noreferrer"
              className={`mt-auto text-xs font-bold ${COLORS.textOrange} flex items-center gap-1 group-hover:gap-2 transition-all p-2 rounded-lg hover:bg-[#F9703E]/10 w-fit`}
            >
              LEER COMPLETO <ExternalLink size={12} />
            </a>
          </div>
        </article>
    );
};


// --- Componente Principal de la Sección ---
const NewsSection = ({ news = [] }) => {
  return (
    <div className="relative py-12 px-6 z-10">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {news.map((item, index) => (
            // Usamos el sub-componente aquí
            <NewsCard key={item.id || index} item={item} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default NewsSection;