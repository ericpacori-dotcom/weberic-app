import React from 'react';
import { X, ShieldCheck, FileText, Info, HelpCircle } from 'lucide-react'; // Importamos nuevos iconos
import { LEGAL_DATA } from '../content/legal_data';

// --- PALETA HAERIC1 ---
const COLORS = {
  bgOverlay: "bg-[#102A43]/90",
  bgCard: "bg-[#334E68]",
  textLight: "text-[#F0F4F8]",
  textMuted: "text-[#BCCCDC]",
  accentOrange: "text-[#F9703E]",
  border: "border-[#486581]"
};

const LegalModal = ({ type, onClose }) => {
  if (!type) return null;

  const data = LEGAL_DATA[type]; 
  
  // Selección dinámica de icono según el tipo de contenido
  let Icon = FileText;
  if (type === 'privacy') Icon = ShieldCheck;
  if (type === 'about') Icon = Info;
  if (type === 'help') Icon = HelpCircle;

  return (
    <div className={`fixed inset-0 z-[60] flex items-center justify-center p-4 ${COLORS.bgOverlay} backdrop-blur-md animate-fade-in-up`}>
      <div className={`${COLORS.bgCard} w-full max-w-2xl max-h-[80vh] rounded-[2rem] border ${COLORS.border} shadow-2xl flex flex-col animate-pop-in relative overflow-hidden`}>
        
        {/* Cabecera */}
        <div className={`p-6 border-b ${COLORS.border} flex justify-between items-center bg-[#243B53]`}>
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-full bg-[#102A43] ${COLORS.accentOrange}`}>
              <Icon size={24} />
            </div>
            <h2 className={`text-2xl font-black ${COLORS.textLight}`}>{data?.title || "Información"}</h2>
          </div>
          <button onClick={onClose} className={`${COLORS.textMuted} hover:text-white hover:bg-[#102A43] p-2 rounded-full transition-all`}>
            <X size={24} />
          </button>
        </div>

        {/* Contenido Scrollable */}
        <div className="p-8 overflow-y-auto custom-scrollbar">
          <div 
            className={`${COLORS.textMuted} leading-relaxed text-sm space-y-4`}
            dangerouslySetInnerHTML={{ __html: data?.content || "<p>Contenido no disponible.</p>" }} 
          />
        </div>

        {/* Pie */}
        <div className={`p-6 border-t ${COLORS.border} bg-[#243B53] flex justify-end`}>
          <button 
            onClick={onClose}
            className={`px-8 py-2 rounded-full font-bold bg-[#F9703E] text-white hover:bg-[#DE5E2E] transition-colors`}
          >
            Cerrar
          </button>
        </div>

      </div>
    </div>
  );
};

export default LegalModal;