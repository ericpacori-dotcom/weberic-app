// src/components/ToolsSection.jsx
import React, { useState, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ExternalLink, Zap, Star, ChevronRight, Tag } from 'lucide-react';
import { COLORS } from '../utils/constants';
// IMPORTANTE: Importamos la base de datos masiva
import { AI_TOOLS_DATA } from '../content/tools_data'; 

const ToolsSection = () => {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState('Todas');
  
  // --- LÓGICA DE ARRASTRE DEL MOUSE (DRAG TO SCROLL) ---
  const sliderRef = useRef(null);
  const [isDown, setIsDown] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  // 1. OBTENER CATEGORÍAS ÚNICAS
  const categories = useMemo(() => {
    // Obtenemos todas las categorías de las herramientas
    const allCats = AI_TOOLS_DATA.map(t => t.category ? t.category.trim() : 'Otros');
    const uniqueCats = new Set(allCats);
    
    // Ordenamos alfabéticamente
    const sortedCats = Array.from(uniqueCats).sort();
    
    // Agregamos "Todas" al principio explícitamente
    return ['Todas', ...sortedCats];
  }, []);

  // 2. FILTRAR HERRAMIENTAS
  const filteredTools = useMemo(() => {
    let tools = AI_TOOLS_DATA;

    // Si la categoría no es "Todas", filtramos
    if (activeCategory !== 'Todas') {
      tools = tools.filter(tool => (tool.category ? tool.category.trim() : 'Otros') === activeCategory);
    }

    // Ordenar por popularidad (mayor a menor)
    return tools.sort((a, b) => (b.popularity || 0) - (a.popularity || 0));
  }, [activeCategory]);

  // --- MANEJADORES DE SCROLL ---
  const handleMouseDown = (e) => {
    setIsDown(true);
    setStartX(e.pageX - sliderRef.current.offsetLeft);
    setScrollLeft(sliderRef.current.scrollLeft);
  };
  
  const handleMouseLeave = () => setIsDown(false);
  const handleMouseUp = () => setIsDown(false);
  
  const handleMouseMove = (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - sliderRef.current.offsetLeft;
    const walk = (x - startX) * 2; 
    sliderRef.current.scrollLeft = scrollLeft - walk;
  };

  return (
    <div className="relative py-12 px-4 md:px-6 z-10 min-h-screen">
      <style>{`
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      <div className="max-w-7xl mx-auto">
        
        {/* ENCABEZADO */}
        <div className="text-center mb-10 animate-fade-in-up">
          <span className={`inline-block py-1 px-3 rounded-full ${COLORS.bgCard} border border-[#627D98] text-[10px] font-bold text-[#BCCCDC] tracking-widest mb-4`}>
            <Zap size={10} className="inline mr-1 text-[#F9703E]" /> +200 HERRAMIENTAS
          </span>
          <h2 className={`text-3xl md:text-4xl font-black ${COLORS.textLight} mb-4`}>
            Catálogo de <span className={COLORS.textOrange}>Inteligencia Artificial</span>
          </h2>
          <p className={`${COLORS.textMuted} max-w-2xl mx-auto text-sm md:text-base`}>
            Explora nuestra base de datos curada y clasificada por especialidad.
          </p>
        </div>

        {/* BARRA DE CATEGORÍAS */}
        <div className="sticky top-20 z-30 bg-[#102A43]/95 backdrop-blur-md py-4 -mx-4 px-4 md:mx-0 md:px-0 mb-8 border-b border-[#486581]/50">
          <div 
            ref={sliderRef}
            className="flex overflow-x-auto gap-2 pb-2 hide-scrollbar justify-start md:justify-center items-center select-none cursor-grab active:cursor-grabbing"
            onMouseDown={handleMouseDown}
            onMouseLeave={handleMouseLeave}
            onMouseUp={handleMouseUp}
            onMouseMove={handleMouseMove}
          >
             {categories.map(cat => (
               <button
                 key={cat}
                 onClick={() => { if(!isDown) setActiveCategory(cat); }}
                 className={`whitespace-nowrap px-5 py-2 rounded-full text-xs font-bold transition-all border flex-shrink-0 pointer-events-auto ${
                   activeCategory === cat 
                   ? `bg-[#F9703E] text-white border-[#F9703E] shadow-lg scale-105` 
                   : `${COLORS.bgCard} text-[#BCCCDC] border-[#486581] hover:text-white hover:border-[#F9703E]`
                 }`}
               >
                 {cat}
               </button>
             ))}
          </div>
          <p className="text-center text-[10px] text-[#BCCCDC] font-bold mt-2 uppercase tracking-widest">
            {isDown ? "Deslizando..." : `Mostrando ${filteredTools.length} herramientas de ${activeCategory}`}
          </p>
        </div>

        {/* GRID DE HERRAMIENTAS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-fade-in-up">
          {filteredTools.map((tool) => (
            <div 
              key={tool.id}
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
                       <span className="text-[9px] font-bold text-[#BCCCDC]">{tool.popularity || 80}% Pop.</span>
                    </div>
                 </div>
              </div>
              
              <div className="mb-3">
                <span className={`inline-flex items-center gap-1 py-0.5 px-2 rounded-md bg-[#334E68] text-[#F9703E] text-[9px] font-bold uppercase tracking-wider`}>
                   <Tag size={8} /> {tool.category || 'General'}
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
          <div className="text-center py-20">
            <p className="text-xl font-bold text-[#BCCCDC]">No se encontraron herramientas.</p>
            <button onClick={() => setActiveCategory('Todas')} className="text-[#F9703E] underline mt-2 text-sm font-bold">
              Ver todas las herramientas
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

export default ToolsSection;