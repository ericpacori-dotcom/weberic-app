// src/views/ToolDetailView.jsx
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ChevronRight, 
  ExternalLink, 
  Lightbulb, 
  Terminal, 
  Zap, 
  Copy, 
  Check, 
  Star,
  Share2
} from 'lucide-react';
import Navbar from '../components/Navbar';
import { COLORS } from '../utils/constants';
// IMPORTANTE: Conectamos con la nueva base de datos de herramientas
import { AI_TOOLS_DATA } from '../content/tools_data';

const ToolDetailView = ({ user, userData, handleLogin, handleLogout }) => {
  const { toolId } = useParams();
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);

  // Buscar la herramienta en el nuevo archivo de datos
  const tool = AI_TOOLS_DATA.find(t => t.id === toolId);

  // Manejo de herramienta no encontrada
  if (!tool) {
    return (
      <div className="min-h-screen bg-[#334E68] flex items-center justify-center text-white font-sans">
        <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Herramienta no encontrada 😕</h2>
            <button 
                onClick={() => navigate('/')}
                className="bg-[#F9703E] px-6 py-2 rounded-full font-bold hover:scale-105 transition-transform"
            >
                Volver al Inicio
            </button>
        </div>
      </div>
    );
  }

  // Función para copiar el prompt
  const handleCopyPrompt = () => {
    if (tool.prompt) {
        navigator.clipboard.writeText(tool.prompt);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    // FONDO BASE: #334E68 (Slate 800 - Igual que HomeView para congruencia)
    <div className={`min-h-screen pb-20 font-sans bg-[#334E68] text-[#F0F4F8] animate-fade-in-up overflow-x-hidden relative z-10`}>
      
      <Navbar user={user} userData={userData} handleLogin={handleLogin} handleLogout={handleLogout} />
      
      {/* HEADER HERO SECTION */}
      <div className={`relative pt-24 pb-16 px-6 border-b border-[#627D98]/50 z-10 bg-[#334E68]/95 backdrop-blur-md`}>
        <div className="max-w-5xl mx-auto relative z-10 animate-fade-in-up">
           
           {/* BOTÓN VOLVER */}
           <button 
             onClick={() => navigate(-1)} 
             className={`group inline-flex items-center text-[#BCCCDC] hover:text-white font-bold bg-[#486581]/50 px-4 py-2 rounded-full mb-8 transition-all border border-[#627D98] hover:border-[#F9703E] hover:-translate-x-1 text-xs uppercase tracking-wider`}
           >
             <ChevronRight size={14} className="mr-1 rotate-180" /> VOLVER AL CATÁLOGO
           </button>

           <div className="flex flex-col md:flex-row items-start md:items-center gap-8">
              {/* LOGO DE LA HERRAMIENTA */}
              <div className="w-28 h-28 md:w-36 md:h-36 rounded-[2rem] bg-white p-4 shadow-[0_0_30px_rgba(249,112,62,0.2)] border-4 border-[#F9703E] flex-shrink-0 relative group">
                 <div className="absolute inset-0 bg-[#F9703E] opacity-0 group-hover:opacity-10 rounded-[1.7rem] transition-opacity duration-300"></div>
                 <img 
                    src={tool.image} 
                    alt={tool.name} 
                    className="w-full h-full object-contain relative z-10" 
                    onError={(e) => { e.target.style.display = 'none'; }}
                 />
              </div>

              {/* INFORMACIÓN PRINCIPAL */}
              <div className="flex-1">
                 <div className="flex flex-wrap items-center gap-3 mb-3">
                    <span className={`inline-block py-1 px-3 rounded-lg bg-[#F9703E]/20 text-[#F9703E] border border-[#F9703E]/30 text-[10px] font-black tracking-widest uppercase`}>
                        {tool.category}
                    </span>
                    <span className="flex items-center gap-1 text-[#BCCCDC] text-xs font-bold bg-[#486581]/50 px-2 py-1 rounded-lg border border-[#627D98]">
                        <Star size={12} className="text-yellow-400 fill-yellow-400" /> {tool.popularity}% POPULARIDAD
                    </span>
                 </div>
                 
                 <h1 className="text-4xl md:text-6xl font-black mb-4 tracking-tight text-white leading-none">
                    {tool.name}
                 </h1>
                 
                 <div className="flex flex-wrap gap-4">
                    <a 
                        href={tool.website} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="inline-flex items-center gap-2 bg-[#F9703E] text-white px-6 py-3 rounded-xl font-bold hover:bg-[#ff8c61] hover:shadow-lg hover:shadow-[#F9703E]/30 transition-all transform hover:-translate-y-1"
                    >
                        Visitar Sitio Web <ExternalLink size={18} strokeWidth={3} />
                    </a>
                    <button className="inline-flex items-center gap-2 bg-[#486581] text-[#BCCCDC] px-5 py-3 rounded-xl font-bold hover:text-white hover:bg-[#627D98] transition-colors border border-[#627D98]">
                        <Share2 size={18} /> Compartir
                    </button>
                 </div>
              </div>
           </div>
        </div>
      </div>

      {/* CONTENIDO DETALLADO */}
      <div className="max-w-5xl mx-auto px-6 -mt-10 relative z-20 space-y-8 pb-24">
         
         {/* TARJETA DE DESCRIPCIÓN */}
         <div className={`bg-[#486581] p-8 md:p-10 rounded-[2.5rem] border border-[#627D98] shadow-2xl relative overflow-hidden group`}>
            <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none group-hover:scale-110 transition-transform duration-700">
                <Zap size={200} />
            </div>
            <h3 className="text-xl font-black text-white mb-6 flex items-center gap-3 relative z-10">
                <div className="p-2 bg-[#F9703E]/20 rounded-lg text-[#F9703E]"><Zap size={20} /></div>
                ¿Qué es y para qué sirve?
            </h3>
            <p className="text-lg md:text-xl leading-relaxed text-[#D9E2EC] font-medium relative z-10">
                {tool.description}
            </p>
         </div>

         {/* GRID DE TIPS Y PROMPTS */}
         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* TARJETA DE CONSEJO (TIP) */}
            <div className={`bg-[#334E68] p-8 rounded-[2.5rem] border border-[#627D98] shadow-xl relative overflow-hidden group hover:border-[#F9703E]/50 transition-colors`}>
                <div className="absolute -right-6 -top-6 text-[#F9703E] opacity-10 rotate-12">
                    <Lightbulb size={180} />
                </div>
                
                <h4 className="font-black text-[#F9703E] uppercase tracking-widest text-xs mb-4 flex items-center gap-2">
                    <Lightbulb size={16}/> Consejo Pro
                </h4>
                
                <p className="text-[#F0F4F8] text-lg font-medium relative z-10 leading-relaxed">
                    {tool.tip || "Explora las configuraciones avanzadas para obtener mejores resultados."}
                </p>
            </div>

            {/* TARJETA DE PROMPT (SOLO SI EXISTE) */}
            {tool.prompt ? (
                <div className={`bg-[#102A43] p-8 rounded-[2.5rem] border border-[#627D98] shadow-xl relative overflow-hidden group hover:border-[#48BB78]/50 transition-colors flex flex-col`}>
                    <div className="absolute -right-6 -top-6 text-[#48BB78] opacity-10 rotate-12">
                        <Terminal size={180} />
                    </div>

                    <div className="flex justify-between items-center mb-4 relative z-10">
                        <h4 className="font-black text-[#48BB78] uppercase tracking-widest text-xs flex items-center gap-2">
                            <Terminal size={16}/> Prompt Mágico
                        </h4>
                        <button 
                            onClick={handleCopyPrompt}
                            className={`p-2 rounded-lg transition-colors ${copied ? 'bg-[#48BB78] text-white' : 'bg-[#334E68] text-[#BCCCDC] hover:text-white'}`}
                            title="Copiar prompt"
                        >
                            {copied ? <Check size={16} /> : <Copy size={16} />}
                        </button>
                    </div>

                    <div className="bg-black/40 p-5 rounded-2xl border border-[#627D98]/30 flex-grow relative z-10 group-hover:border-[#48BB78]/30 transition-colors">
                        <p className="text-[#D9E2EC] font-mono text-sm italic leading-relaxed">
                            "{tool.prompt}"
                        </p>
                    </div>
                </div>
            ) : (
                // Placeholder si no hay prompt
                <div className={`bg-[#334E68] p-8 rounded-[2.5rem] border border-[#627D98] flex items-center justify-center text-center opacity-70`}>
                    <div>
                        <Terminal size={40} className="mx-auto mb-2 text-[#627D98]" />
                        <p className="text-sm font-bold text-[#BCCCDC]">Esta herramienta no requiere prompts complejos.</p>
                    </div>
                </div>
            )}

         </div>
      </div>
    </div>
  );
};

export default ToolDetailView;