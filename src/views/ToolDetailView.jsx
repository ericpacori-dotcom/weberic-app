// src/views/ToolDetailView.jsx
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronRight, ExternalLink, Lightbulb, Terminal, Zap } from 'lucide-react';
import Navbar from '../components/Navbar';
import { COLORS } from '../utils/constants';
import { AI_TOOLS_DATA } from '../content/ai_tools_data';

const ToolDetailView = ({ user, userData, handleLogin, handleLogout }) => {
  const { toolId } = useParams();
  const navigate = useNavigate();
  const tool = AI_TOOLS_DATA.find(t => t.id === toolId);

  if (!tool) return <div className="text-center p-10 text-white">Herramienta no encontrada</div>;

  return (
    <div className={`min-h-screen pb-20 font-sans ${COLORS.textLight} animate-fade-in-up overflow-x-hidden relative z-10`}>
      <Navbar user={user} userData={userData} handleLogin={handleLogin} handleLogout={handleLogout} />
      
      <div className={`relative pt-20 pb-12 px-6 border-b border-[#486581] z-10 bg-[#334E68]/80 backdrop-blur-md`}>
        <div className="max-w-4xl mx-auto relative z-10 animate-fade-in-up">
           <button onClick={() => navigate(-1)} className={`group inline-flex items-center ${COLORS.textMuted} hover:text-white font-bold ${COLORS.bgCard} px-3 py-1.5 rounded-full mb-6 transition-all border border-[#627D98] hover:border-[#F9703E] hover:-translate-x-1 text-[10px] uppercase tracking-wider`}>
             <ChevronRight size={12} className="mr-1 rotate-180" /> Volver
           </button>
           <div className="flex flex-col md:flex-row items-center gap-6 md:gap-8">
              <div className="w-24 h-24 md:w-32 md:h-32 rounded-3xl bg-white p-4 shadow-2xl border-4 border-[#F9703E] flex-shrink-0"><img src={tool.icon} alt={tool.name} className="w-full h-full object-contain" /></div>
              <div className="text-center md:text-left"><span className={`inline-block py-1 px-3 rounded-full bg-[#F9703E]/20 text-[#F9703E] border border-[#F9703E]/30 text-xs font-black tracking-widest mb-2 uppercase`}>{tool.category}</span><h1 className={`text-4xl md:text-6xl font-black mb-2 tracking-tight ${COLORS.textLight}`}>{tool.name}</h1><a href={tool.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-[#48BB78] font-bold hover:underline hover:text-white transition-colors">Visitar Sitio Oficial <ExternalLink size={16}/></a></div>
           </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 -mt-8 relative z-20 space-y-8 pb-24">
         <div className={`${COLORS.bgCard} p-8 rounded-[2rem] border border-[#627D98] shadow-2xl`}>
            <h3 className="text-xl font-black text-white mb-4 flex items-center gap-2"><Zap className="text-[#F9703E]" /> ¿Qué es esto?</h3>
            <p className="text-lg leading-relaxed text-[#BCCCDC] font-medium">{tool.description}</p>
         </div>
         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className={`${COLORS.bgMain} p-6 rounded-[2rem] border border-[#486581] relative overflow-hidden group hover:border-[#F9703E] transition-colors`}><div className="absolute top-0 right-0 p-4 opacity-10"><Lightbulb size={100} /></div><h4 className="font-black text-[#F9703E] uppercase tracking-widest text-xs mb-3 flex items-center gap-2"><Lightbulb size={14}/> Pro Tip</h4><p className="text-white font-medium relative z-10">{tool.tips?.[0] || "Explora las opciones avanzadas."}</p></div>
            <div className={`${COLORS.bgMain} p-6 rounded-[2rem] border border-[#486581] relative overflow-hidden group hover:border-[#48BB78] transition-colors`}><div className="absolute top-0 right-0 p-4 opacity-10"><Terminal size={100} /></div><h4 className="font-black text-[#48BB78] uppercase tracking-widest text-xs mb-3 flex items-center gap-2"><Terminal size={14}/> Prompt Mágico</h4><div className="bg-black/30 p-3 rounded-xl border border-white/10"><p className="text-[#BCCCDC] font-mono text-sm relative z-10 italic">"{tool.prompts?.[0] || 'Create something amazing...'}"</p></div></div>
         </div>
      </div>
    </div>
  );
};
export default ToolDetailView;