import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, ExternalLink, X, Zap, 
  Image, Video, Bot, Box, Layout, Code, Sparkles, ChevronRight, Copy, Play, Youtube, Info, Lightbulb, Cpu
} from 'lucide-react';
import { AI_TOOLS_DATA, TOOL_CATEGORIES } from '../content/ai_tools_data';

// --- FONDO DE CIRCUITOS (Sin cambios) ---
const CircuitBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let width, height;
    let particles = [];
    const gridSize = 40; 

    const resize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resize);
    resize();

    class Signal {
      constructor() {
        this.reset();
      }

      reset() {
        this.x = Math.floor(Math.random() * (width / gridSize)) * gridSize;
        this.y = Math.floor(Math.random() * (height / gridSize)) * gridSize;
        
        const dirs = [{x:1, y:0}, {x:-1, y:0}, {x:0, y:1}, {x:0, y:-1}];
        this.dir = dirs[Math.floor(Math.random() * dirs.length)];
        
        this.life = 0;
        this.maxLife = Math.random() * 150 + 100; 
        this.speed = 2; 
        this.history = []; 
        this.historyLength = Math.random() * 30 + 20;
        this.color = Math.random() > 0.8 ? '#F9703E' : '#4DB6AC'; 
      }

      update() {
        this.life++;
        this.history.push({x: this.x, y: this.y});
        if (this.history.length > this.historyLength) {
          this.history.shift();
        }
        this.x += this.dir.x * this.speed;
        this.y += this.dir.y * this.speed;

        if (this.life % 25 === 0 && Math.random() > 0.6) { 
          if (this.dir.x !== 0) {
            this.dir = Math.random() > 0.5 ? {x:0, y:1} : {x:0, y:-1};
          } else {
            this.dir = Math.random() > 0.5 ? {x:1, y:0} : {x:-1, y:0};
          }
        }

        if (this.x < 0 || this.x > width || this.y < 0 || this.y > height || this.life > this.maxLife) {
          this.reset();
        }
      }

      draw() {
        ctx.beginPath();
        if (this.history.length > 0) {
            ctx.moveTo(this.history[0].x, this.history[0].y);
            for (let i = 1; i < this.history.length; i++) {
                ctx.lineTo(this.history[i].x, this.history[i].y);
            }
        }
        ctx.lineTo(this.x, this.y);
        ctx.strokeStyle = this.color;
        ctx.lineWidth = 2;
        ctx.lineCap = 'square';
        ctx.shadowBlur = 5;
        ctx.shadowColor = this.color;
        ctx.globalAlpha = 0.6; 
        ctx.stroke();
        ctx.globalAlpha = 1;
        ctx.shadowBlur = 0;
        ctx.fillStyle = '#fff';
        ctx.fillRect(this.x - 1, this.y - 1, 3, 3);
      }
    }

    const particleCount = 20; 
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Signal());
    }

    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.02)';
      for (let x = 0; x < width; x += gridSize) {
        for (let y = 0; y < height; y += gridSize) {
          ctx.fillRect(x-1, y-1, 2, 2);
        }
      }
      particles.forEach(p => {
        p.update();
        p.draw();
      });
      requestAnimationFrame(animate);
    };
    animate();
    return () => window.removeEventListener('resize', resize);
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 z-0 pointer-events-none opacity-60" />;
};

const ICON_MAP = {
  Image: Image,
  Video: Video,
  Bot: Bot,
  Box: Box,
  Layout: Layout,
  Code: Code,
  Sparkles: Sparkles
};

const COLORS = {
  bgMain: "bg-[#334E68]",
  bgCard: "bg-[#486581]",
  accentOrange: "text-[#F9703E]",
  bgOrange: "bg-[#F9703E]",
  textLight: "text-[#F0F4F8]",
  textMuted: "text-[#BCCCDC]",
};

const AIToolsView = ({ setView }) => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTool, setSelectedTool] = useState(null);

  const filteredTools = AI_TOOLS_DATA.filter(tool => {
    const matchesCategory = activeCategory === 'all' || tool.category === activeCategory;
    const matchesSearch = tool.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          tool.shortDesc.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  return (
    // CAMBIO CLAVE: h-screen y overflow-hidden para que la ventana principal NO haga scroll
    <div className={`h-screen w-full ${COLORS.bgMain} ${COLORS.textLight} font-sans selection:bg-[#F9703E] selection:text-white flex flex-col overflow-hidden relative`}>
      
      {/* 1. FONDO DE CIRCUITOS (Fijo atrás) */}
      <CircuitBackground />

      {/* 2. SECCIÓN SUPERIOR FIJA (Header + Buscador + Filtros) */}
      {/* Esta sección NO se moverá nunca */}
      <div className="flex-shrink-0 z-20 bg-[#334E68]/95 backdrop-blur-md border-b border-[#486581] shadow-2xl relative">
        <div className="max-w-7xl mx-auto px-6 pt-8 pb-6">
          
          {/* Fila Superior: Botón Volver y Título pequeño */}
          <div className="flex items-center justify-between mb-6">
            <button onClick={() => setView('home')} className={`group flex items-center ${COLORS.textMuted} hover:text-white font-bold ${COLORS.bgCard} px-4 py-2 rounded-full transition-all border border-[#627D98] hover:border-[#F9703E] hover:-translate-x-1 shadow-md text-sm`}>
                <ChevronRight size={16} className="mr-2 rotate-180" /> Volver
            </button>
            <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-[#F9703E]/10 border border-[#F9703E]/30 text-[#F9703E] font-bold text-[10px] animate-pulse">
              <Cpu size={12} /> DIRECTORIO IA 2.0
            </div>
          </div>

          {/* Título Principal */}
          <div className="text-center mb-6">
            <h1 className="text-3xl md:text-5xl font-black tracking-tight drop-shadow-xl mb-2">
              Arsenal de <span className={COLORS.accentOrange}>Tecnología</span>
            </h1>
            <p className={`${COLORS.textMuted} text-sm md:text-base max-w-xl mx-auto`}>
              Explora las herramientas que están redefiniendo el futuro.
            </p>
          </div>

          {/* Buscador */}
          <div className="relative max-w-lg mx-auto mb-4">
            <Search className={`absolute left-4 top-3.5 h-5 w-5 ${COLORS.textMuted}`} />
            <input 
              type="text" 
              placeholder="Buscar herramienta (ej: Midjourney...)" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full pl-12 pr-4 py-3 rounded-full ${COLORS.bgCard} border border-[#627D98] focus:border-[#F9703E] focus:outline-none focus:ring-1 focus:ring-[#F9703E] text-white placeholder-gray-400 transition-all shadow-inner`}
            />
          </div>

          {/* Filtros */}
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide justify-start md:justify-center">
            {TOOL_CATEGORIES.map(cat => {
              const Icon = ICON_MAP[cat.icon];
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs md:text-sm font-bold whitespace-nowrap transition-all duration-300 border ${
                    isActive 
                      ? `${COLORS.bgOrange} text-white border-[#F9703E] shadow-lg scale-105` 
                      : `${COLORS.bgCard} ${COLORS.textMuted} border-[#627D98] hover:text-white hover:border-[#F9703E]`
                  }`}
                >
                  <Icon size={14} />
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 3. ÁREA DE CONTENIDO SCROLLABLE (GRID DE HERRAMIENTAS) */}
      {/* Esta es la única parte que hace scroll */}
      <div className="flex-1 overflow-y-auto z-10 p-6 custom-scrollbar scroll-smooth">
        <div className="max-w-7xl mx-auto pb-20"> {/* pb-20 para espacio extra al final */}
          {filteredTools.length === 0 ? (
            <div className="text-center py-20 text-[#BCCCDC]">
              <Search size={48} className="mx-auto mb-4 opacity-50" />
              <p className="text-xl font-bold">No encontramos herramientas con ese nombre.</p>
              <button onClick={() => {setSearchTerm(''); setActiveCategory('all');}} className="mt-4 text-[#F9703E] underline">Ver todas</button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
              {filteredTools.map((tool, index) => (
                <div 
                  key={tool.id}
                  onClick={() => setSelectedTool(tool)}
                  className={`group cursor-pointer ${COLORS.bgCard} rounded-[2rem] border border-[#627D98] p-6 hover:border-[#F9703E] transition-all duration-300 hover:-translate-y-2 shadow-xl hover:shadow-[#F9703E]/20 relative overflow-hidden flex flex-col backdrop-blur-md bg-opacity-90`}
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-[#F9703E]/0 to-[#F9703E]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                  <div className="relative z-10 flex flex-col h-full">
                    <div className="flex justify-between items-start mb-4">
                      <div className="w-16 h-16 rounded-2xl bg-white p-2 shadow-md overflow-hidden flex items-center justify-center">
                          {tool.icon.startsWith('http') ? (
                              <img src={tool.icon} alt={tool.name} className="w-full h-full object-contain" />
                          ) : (
                              <span className="text-2xl font-black text-[#334E68]">{tool.name[0]}</span>
                          )}
                      </div>
                      {tool.videoUrl && (
                        <div className="bg-[#FF0000]/20 text-[#FF0000] border border-[#FF0000]/30 px-3 py-1 rounded-full text-[10px] font-black flex items-center gap-1">
                          <Play size={10} fill="currentColor"/> VIDEO
                        </div>
                      )}
                    </div>
                    
                    <h3 className="text-2xl font-black mb-2 group-hover:text-[#F9703E] transition-colors">{tool.name}</h3>
                    <p className="text-[#BCCCDC] text-sm leading-relaxed line-clamp-3 mb-6">{tool.shortDesc}</p>
                    
                    <div className="mt-auto pt-4 border-t border-[#627D98] flex justify-between items-center text-xs font-bold text-[#F9703E]">
                      <span>VER DETALLES</span>
                      <div className="bg-[#334E68] p-1.5 rounded-full group-hover:bg-[#F9703E] group-hover:text-white transition-colors">
                        <ChevronRight size={16} />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* --- MODAL DE DETALLE (FULL CONTENT) --- */}
      {selectedTool && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#102A43]/90 backdrop-blur-md animate-fade-in">
          <div className={`${COLORS.bgCard} w-full max-w-4xl max-h-[90vh] rounded-[2.5rem] shadow-2xl border border-[#627D98] overflow-hidden flex flex-col animate-pop-in relative`}>
            
            <button 
              onClick={() => setSelectedTool(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-black/50 text-white hover:bg-[#F9703E] transition-colors z-50 backdrop-blur-sm"
            >
              <X size={24} />
            </button>

            <div className="overflow-y-auto custom-scrollbar flex-1 bg-[#334E68]">
              
              {/* VIDEO HERO */}
              {selectedTool.videoUrl ? (
                <div className="w-full aspect-video bg-black relative group">
                  <iframe 
                    src={selectedTool.videoUrl} 
                    title={selectedTool.name}
                    className="w-full h-full"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
              ) : (
                <div className={`h-32 ${COLORS.bgMain} flex items-center justify-center relative overflow-hidden`}>
                   <div className="absolute inset-0 bg-[#F9703E] opacity-10"></div>
                   <Sparkles size={48} className="text-[#F9703E] opacity-50 animate-pulse"/>
                </div>
              )}

              {/* CONTENT */}
              <div className="p-8 md:p-10">
                <div className="flex flex-col md:flex-row gap-6 md:items-start mb-8">
                  <div className="w-20 h-20 rounded-2xl bg-white p-3 shadow-lg flex-shrink-0 flex items-center justify-center">
                      <img src={selectedTool.icon} alt={selectedTool.name} className="w-full h-full object-contain" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-4xl font-black text-white mb-2">{selectedTool.name}</h2>
                    <p className="text-[#BCCCDC] text-lg leading-relaxed mb-4">{selectedTool.description}</p>
                    <a href={selectedTool.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-[#F9703E] text-white px-6 py-3 rounded-full font-bold shadow-lg hover:bg-[#D64515] transition-colors">
                      Probar Herramienta <ExternalLink size={18}/>
                    </a>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  
                  {/* LEFT COL */}
                  <div className="space-y-8">
                    <div className="bg-[#102A43]/50 p-6 rounded-3xl border border-[#627D98]">
                      <h4 className="text-sm font-black text-[#F9703E] uppercase tracking-widest mb-4 flex items-center gap-2"><Zap size={18}/> Funciones</h4>
                      <ul className="space-y-3">
                        {selectedTool.features.map((feat, i) => (
                          <li key={i} className="flex items-start gap-3 text-sm text-[#F0F4F8]">
                            <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#48BB78] flex-shrink-0"></div>
                            {feat}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="bg-[#102A43]/50 p-6 rounded-3xl border border-[#627D98]">
                      <h4 className="text-sm font-black text-[#F9703E] uppercase tracking-widest mb-4 flex items-center gap-2"><Lightbulb size={18}/> Tips de Experto</h4>
                      <ul className="space-y-4">
                        {selectedTool.tips.map((tip, i) => (
                          <li key={i} className="flex gap-3 text-sm text-[#BCCCDC]">
                            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#F9703E]/20 text-[#F9703E] flex items-center justify-center font-bold text-xs">{i+1}</span>
                            {tip}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* RIGHT COL */}
                  <div className="space-y-8">
                    {selectedTool.gallery && (
                      <div>
                        <h4 className="text-sm font-black text-[#F9703E] uppercase tracking-widest mb-4 flex items-center gap-2"><Image size={18}/> Ejemplos Generados</h4>
                        <div className="grid grid-cols-2 gap-3">
                          {selectedTool.gallery.map((img, i) => (
                            <div key={i} className="aspect-square rounded-xl overflow-hidden border border-[#627D98] group relative">
                              <img src={img} alt="Ejemplo" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {selectedTool.prompts && (
                      <div>
                        <h4 className="text-sm font-black text-[#F9703E] uppercase tracking-widest mb-4 flex items-center gap-2"><Sparkles size={18}/> Prompts Mágicos</h4>
                        <div className="space-y-3">
                          {selectedTool.prompts.map((prompt, i) => (
                            <div key={i} className="relative group">
                              <div className="bg-[#102A43] p-4 pr-10 rounded-xl border border-[#334E68] text-xs text-[#F0F4F8] font-mono leading-relaxed shadow-inner">
                                "{prompt}"
                              </div>
                              <button 
                                onClick={() => copyToClipboard(prompt)}
                                className="absolute top-2 right-2 p-1.5 rounded-lg bg-[#334E68] text-[#BCCCDC] hover:text-white hover:bg-[#F9703E] transition-all"
                                title="Copiar Prompt"
                              >
                                <Copy size={14} />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default AIToolsView;