// src/components/NewsSection.jsx
import React from 'react';
import { Calendar, Tag, ExternalLink } from 'lucide-react';
import { COLORS } from '../utils/constants';

const NewsSection = ({ news = [] }) => {
  return (
    <div className="relative py-12 px-6 z-10">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {news.map((item, index) => (
            <article 
              key={index} 
              className={`${COLORS.bgCard} rounded-[2rem] border border-[#486581] overflow-hidden hover:border-[#F9703E] transition-all duration-300 group hover:-translate-y-1 shadow-lg flex flex-col`}
            >
              {/* ZONA DE IMAGEN REDUCIDA Y SOLO LOGO */}
              <div className="h-32 overflow-hidden relative bg-white/5 flex items-center justify-center p-6 border-b border-[#486581]/50">
                <img 
                  src={item.image} 
                  alt={item.source} 
                  className="w-full h-full object-contain filter drop-shadow-md group-hover:scale-110 transition-transform duration-500" 
                  onError={(e) => {e.target.style.opacity='0.5'}} 
                />
                
                <div className="absolute top-3 left-3">
                  <span className={`${COLORS.bgMain} text-[#F9703E] text-[9px] font-bold px-2 py-0.5 rounded-full border border-[#F9703E] flex items-center gap-1 shadow-sm`}>
                    <Tag size={8} /> {item.category}
                  </span>
                </div>
              </div>
              
              <div className="p-6 flex-1 flex flex-col">
                <div className="flex items-center gap-2 text-[#BCCCDC] text-xs font-bold mb-3">
                  <Calendar size={12} className="text-[#F9703E]" />
                  <span>{item.date}</span>
                </div>
                
                <h3 className={`text-lg font-black ${COLORS.textLight} mb-3 leading-tight group-hover:text-[#F9703E] transition-colors`}>
                  {item.title}
                </h3>
                
                <p className={`${COLORS.textMuted} text-sm line-clamp-3 mb-4 leading-relaxed`}>
                  {item.description}
                </p>
                
                <a 
                  href={item.link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className={`mt-auto text-xs font-bold ${COLORS.textOrange} flex items-center gap-1 group-hover:gap-2 transition-all`}
                >
                  LEER EN {item.source?.toUpperCase()} <ExternalLink size={12} />
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NewsSection;