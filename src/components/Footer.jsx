import React from 'react';
import { Facebook, Twitter, Instagram, Linkedin, Heart, ShieldCheck, FileText, HelpCircle, Info } from 'lucide-react';

// --- PALETA HAERIC1 ---
const COLORS = {
  bgFooter: "bg-[#102A43]",
  textLight: "text-[#F0F4F8]",
  textMuted: "text-[#BCCCDC]",
  accentOrange: "text-[#F9703E]",
  border: "border-[#486581]"
};

// Recibimos la función onOpenLegal como prop para abrir los modales
const Footer = ({ onOpenLegal }) => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={`${COLORS.bgFooter} border-t ${COLORS.border} pt-16 pb-8 relative z-20 font-sans`}>
      <div className="max-w-7xl mx-auto px-6">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          
          {/* COLUMNA 1: SOBRE HAERIC */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <span className={`text-2xl font-black ${COLORS.textLight} tracking-tight`}>
                haeric <span className={COLORS.accentOrange}>Activos</span>
              </span>
            </div>
            <p className={`${COLORS.textMuted} leading-relaxed mb-6 max-w-sm`}>
              La plataforma líder para emprendedores que buscan crear activos digitales escalables con Inteligencia Artificial. Aprende, aplica y monetiza.
            </p>
            <div className="flex gap-4">
              <SocialIcon Icon={Facebook} />
              <SocialIcon Icon={Twitter} />
              <SocialIcon Icon={Instagram} />
              <SocialIcon Icon={Linkedin} />
            </div>
          </div>

          {/* COLUMNA 2: LEGAL */}
          <div>
            <h4 className={`font-bold ${COLORS.textLight} mb-6 uppercase tracking-wider text-sm`}>Legal</h4>
            <ul className="space-y-4">
              <li><button onClick={() => onOpenLegal('terms')} className={linkStyle}><FileText size={16}/> Términos y Condiciones</button></li>
              <li><button onClick={() => onOpenLegal('privacy')} className={linkStyle}><ShieldCheck size={16}/> Políticas de Privacidad</button></li>
              <li><button onClick={() => onOpenLegal('privacy')} className={linkStyle}><FileText size={16}/> Cookies</button></li>
            </ul>
          </div>

          {/* COLUMNA 3: EMPRESA */}
          <div>
            <h4 className={`font-bold ${COLORS.textLight} mb-6 uppercase tracking-wider text-sm`}>Empresa</h4>
            <ul className="space-y-4">
              <li><button onClick={() => onOpenLegal('about')} className={linkStyle}><Info size={16}/> Qué es haeric</button></li>
              <li><a href="#" className={linkStyle}>Trabaja con nosotros</a></li>
              <li><button onClick={() => onOpenLegal('help')} className={linkStyle}><HelpCircle size={16}/> Centro de Ayuda</button></li>
            </ul>
          </div>
        </div>

        {/* COPYRIGHT */}
        <div className={`pt-8 border-t ${COLORS.border} flex flex-col md:flex-row justify-between items-center gap-4`}>
          <p className={`${COLORS.textMuted} text-sm`}>© {currentYear} Haeric Inc. Todos los derechos reservados.</p>
          <p className={`${COLORS.textMuted} text-sm flex items-center gap-1`}>Hecho con <Heart size={14} className="text-red-500 fill-red-500" /> en Latinoamérica</p>
        </div>
      </div>
    </footer>
  );
};

// Estilos reutilizables para no repetir clases
const linkStyle = `${COLORS.textMuted} hover:${COLORS.accentOrange} transition-colors flex items-center gap-2 text-sm font-medium bg-transparent border-none cursor-pointer text-left`;

const SocialIcon = ({ Icon }) => (
  <a href="#" className={`p-2 rounded-full bg-[#334E68] ${COLORS.textMuted} hover:text-white hover:bg-[#F9703E] transition-all`}>
    <Icon size={20} />
  </a>
);

export default Footer;