// src/components/ToolsSection.jsx
import React, { useState, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ExternalLink, Zap, Star, ChevronRight, Tag } from 'lucide-react';
import { COLORS } from '../utils/constants';
import { AI_TOOLS_DATA } from '../content/tools_data'; 

const ToolsSection = () => {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState('Todas');
  
  const sliderRef = useRef(null);
  const isDown = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  const GROUP_CONFIG = useMemo(() => ({
    "Chat & Asistentes": ["Chatbots", "Búsqueda", "Productividad", "Agentes", "Detección", "Escritura"],
    "Imagen & Diseño": ["Imágenes", "Edición", "Diseño", "3D"],
    "Video & Animación": ["Video", "VFX"],
    "Audio & Voz": ["Audio", "Música", "Reuniones"],
    "Programación & Data": ["Código", "Desarrollo", "Web", "Data", "Automatización"],
    "Empresa & Marketing": ["Marketing", "Ventas", "Presentaciones", "Atención", "RRHH", "Legal"],
    "Ciencia & Ocio": ["Investigación", "Comunidad", "Entretenimiento", "Juegos", "Utilidad", "Directorio"]
  }), []);

  const menuCategories = ['Todas', ...Object.keys(GROUP_CONFIG)];

  const filteredTools = useMemo(() => {
    if (activeCategory === 'Todas') {
      return [...AI_TOOLS_DATA].sort((a, b) => b.popularity - a.popularity);
    }
    const allowedCategories = GROUP_CONFIG[activeCategory] || [];
    return AI_TOOLS_DATA.filter(tool => {
        const toolCat = tool.category ? tool.category.trim() : 'Otros';
        return allowedCategories.includes(toolCat);
    }).sort((a, b) => b.popularity - a.popularity);
  }, [activeCategory, GROUP_CONFIG]);

  const handleMouseDown = (e) => {
    isDown.current = true;
    startX.current = e.pageX - sliderRef.current.offsetLeft;
    scrollLeft.current = sliderRef.current.scrollLeft;
  };
  const handleMouseLeave = () => { isDown.current = false; };
  const handleMouseUp = () => { isDown.current = false; };
  const handleMouseMove = (e) => {
    if (!isDown.current) return;
    e.preventDefault();
    const x = e.pageX - sliderRef.current.offsetLeft;
    const walk = (x - startX.current) * 2; 
    sliderRef.current.scrollLeft = scrollLeft.current - walk;
  };

  return (
    <div className="relative py-12 px-4 md:px-6 z-10 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10 animate-fade-in-up">
          <span className={`inline-block py-1 px-3 rounded-full ${COLORS.bgCard} border border-[#627D98] text-[10px] font-bold text-[#BCCCDC] tracking-widest mb-4`}>
            <Zap size={10} className="inline mr-1 text-[#F9703E]" /> {AI_TOOLS_DATA.length}+ HERRAMIENTAS
          </span>
          <h2 className={`text-3xl md:text-4xl font-black ${COLORS.textLight} mb-4`}>
            Catálogo de <span className={COLORS.textOrange}>Inteligencia Artificial</span>
          </h2>
          <p className={`${COLORS.textMuted} max-w-2xl mx-auto text-sm md:text-base`}>
            Explora nuestra base de datos curada y clasificada por especialidad.
          </p>
        </div>

        <div className="sticky top-20 z-30 bg-[#102A43]/95 backdrop-blur-md py-4 -mx-4 px-4 md:mx-0 md:px-0 mb-8 border-b border-[#486581]/50">
          <div 
            ref={sliderRef}
            className="flex overflow-x-auto gap-2 pb-2 hide-scrollbar justify-start md:justify-center items-center select-none cursor-grab active:cursor-grabbing"
            onMouseDown={handleMouseDown}
            onMouseLeave={handleMouseLeave}
            onMouseUp={handleMouseUp}
            onMouseMove={handleMouseMove}
          >
             {menuCategories.map(cat => (
               <button
                 key={cat}
                 onClick={() => setActiveCategory(cat)}
                 className={`whitespace-nowrap px-5 py-2 rounded-full text-xs font-bold transition-all border flex-shrink-0 pointer-events-auto flex items-center gap-2 ${
                   activeCategory === cat 
                   ? `bg-[#F9703E] text-white border-[#F9703E] shadow-lg scale-105` 
                   : `${COLORS.bgCard} text-[#BCCCDC] border-[#486581] hover:text-white hover:border-[#F9703E]`
                 }`}
               >
                 {cat}
               </button>
             ))}
          </div>
          <p className="text-center text-[10px] text-[#BCCCDC] font-bold mt-2 uppercase tracking-widest animate-pulse">
            Mostrando {filteredTools.length} herramientas en {activeCategory}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-fade-in-up">
          {filteredTools.map((tool, index) => (
            <div 
              // CORRECCIÓN AQUÍ: Usamos index para garantizar unicidad
              key={`${tool.id}-${index}`}
              onClick={() => navigate(`/herramienta/${tool.id}`)}
              className={`${COLORS.bgCard} p-5 rounded-3xl border border-[#486581] hover:border-[#F9703E] group transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl flex flex-col relative overflow-hidden cursor-pointer h-full`}
            >
              <div className={`absolute top-4 right-4 text-[#486581] group-hover:text-[#F9703E] transition-colors`}>
                  <ChevronRight size={18} />
              </div>
              <div className="flex items-center gap-3 mb-4 pr-6">
                 <div className="w-12 h-12 rounded-xl bg-white p-1.5 border border-[#627D98] flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform shadow-sm overflow-hidden">
                    <img 
                      src={tool.image} 
                      alt={tool.name} 
                      className="w-full h-full object-contain" 
                      loading="lazy"
                      onError={(e) => { e.target.style.display = 'none'; }} 
                    />
                 </div>
                 <div className="overflow-hidden">
                    <h3 className={`text-lg font-black ${COLORS.textLight} mb-0.5 group-hover:text-[#F9703E] transition-colors truncate`}>
                      {tool.name}
                    </h3>
                    <div className="flex items-center gap-1">
                       <Star size={10} className="text-yellow-400 fill-yellow-400"/>
                       <span className="text-[9px] font-bold text-[#BCCCDC]">{tool.popularity}% Pop.</span>
                    </div>
                 </div>
              </div>
              <div className="mb-3">
                <span className={`inline-flex items-center gap-1 py-0.5 px-2 rounded-md bg-[#334E68] text-[#F9703E] text-[9px] font-bold uppercase tracking-wider`}>
                   <Tag size={8} /> {tool.category}
                </span>
              </div>
              <p className={`${COLORS.textMuted} text-xs leading-relaxed line-clamp-3 mb-4 flex-grow`}>
                 {tool.description}
              </p>
              <div className="pt-3 border-t border-[#486581] flex justify-between items-center text-[10px] font-bold text-[#F9703E] opacity-60 group-hover:opacity-100 transition-opacity">
                 <span>VER DETALLES</span>
                 <ExternalLink size={10}/>
              </div>
            </div>
          ))}
        </div>
        
        {filteredTools.length === 0 && (
          <div className="text-center py-20 animate-fade-in">
            <p className="text-xl font-bold text-[#BCCCDC] mb-4">No se encontraron herramientas en este grupo.</p>
            <button 
                onClick={() => setActiveCategory('Todas')} 
                className="bg-[#F9703E] text-white px-6 py-2 rounded-full font-bold shadow-lg hover:scale-105 transition-transform"
            >
              Ver todas las herramientas
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ToolsSection;