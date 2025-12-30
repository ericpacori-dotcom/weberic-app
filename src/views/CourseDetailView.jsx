import React, { useState } from 'react';
import { 
  Play, 
  CheckCircle, 
  Lock, 
  FileText, 
  Download, 
  Wrench, 
  MessageCircle, 
  Star,
  ChevronLeft,
  Share2,
  Menu,
  Clock,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CourseDetailView = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [expandedModules, setExpandedModules] = useState({ 1: true, 2: true });

  const toggleModule = (id) => {
    setExpandedModules(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // Datos simulados
  const course = {
    title: "Curso Avanzado de IA Generativa",
    description: "Domina las herramientas de IA para crear contenido y automatizar tu negocio.",
    instructor: "Eric Pacori",
    rating: 4.8,
    progress: 35,
    modules: [
      {
        id: 1,
        title: "Introducción a la IA",
        duration: "45 min",
        lessons: [
          { id: 101, title: "Bienvenida al curso", type: "video", duration: "5:00", completed: true, isFree: true },
          { id: 102, title: "Configuración del entorno", type: "video", duration: "15:00", completed: true, isFree: true },
          { id: 103, title: "Conceptos básicos", type: "text", duration: "10:00", completed: false, isFree: false }
        ]
      },
      {
        id: 2,
        title: "Ingeniería de Prompts",
        duration: "1h 20min",
        lessons: [
          { id: 201, title: "Estructura de un prompt", type: "video", duration: "20:00", completed: false, isFree: false },
          { id: 202, title: "Prompts avanzados", type: "video", duration: "25:00", completed: false, isFree: false, locked: true },
          { id: 203, title: "Recursos y herramientas", type: "resource", duration: "N/A", completed: false, isFree: false, locked: true }
        ]
      }
    ]
  };

  // COLORES EXACTOS EXTRAÍDOS DE TUS ARCHIVOS:
  // Fondo: #334E68 (index.css)
  // Tarjetas: #486581 (HomeView.jsx)
  // Bordes: #627D98 (HomeView.jsx)
  // Acento: #F9703E (HomeView.jsx)

  return (
    <div className="flex flex-col h-screen bg-[#334E68] text-[#F0F4F8] font-sans selection:bg-[#F9703E] selection:text-white">
      
      {/* Ocultar barras de desplazamiento */}
      <style>{`
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      {/* HEADER: Mismo fondo con transparencia */}
      <header className="h-16 px-4 lg:px-6 flex items-center justify-between z-30 sticky top-0 bg-[#334E68]/90 backdrop-blur-md border-b border-[#627D98]/50">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate(-1)} 
            className="p-2 -ml-2 text-[#BCCCDC] hover:text-[#F9703E] hover:bg-white/5 rounded-full transition-all"
          >
            <ChevronLeft size={24} />
          </button>
          
          <h1 className="text-base lg:text-lg font-bold text-white truncate max-w-[200px] lg:max-w-md leading-tight tracking-wide">
            {course.title}
          </h1>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-3 bg-[#486581]/50 py-1.5 px-3 rounded-full border border-[#627D98]/50">
            <div className="flex flex-col items-end">
               <span className="text-[10px] font-bold text-[#F9703E] leading-none">{course.progress}%</span>
            </div>
            <div className="w-20 bg-[#627D98] rounded-full h-1.5 overflow-hidden">
              <div 
                className="bg-[#F9703E] h-full rounded-full shadow-[0_0_8px_rgba(249,112,62,0.6)] transition-all duration-500" 
                style={{ width: `${course.progress}%` }}
              ></div>
            </div>
          </div>
          
          <button className="hidden sm:flex items-center gap-2 px-4 py-2 text-sm font-medium text-[#F0F4F8] bg-white/5 border border-white/10 rounded-xl hover:bg-[#F9703E] hover:text-white hover:border-[#F9703E] transition-all duration-300">
            <Share2 size={18} />
            <span>Compartir</span>
          </button>
          
          <button 
            className="lg:hidden p-2 text-[#F0F4F8] hover:bg-white/10 rounded-lg"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <Menu size={24} />
          </button>
        </div>
      </header>

      {/* CONTENIDO PRINCIPAL */}
      <div className="flex-1 flex overflow-hidden relative">
        
        {/* LADO IZQUIERDO */}
        <div className="flex-1 overflow-y-auto hide-scrollbar">
          <div className="max-w-6xl mx-auto p-4 lg:p-8">
            
            {/* Reproductor de Video */}
            <div className="relative group mb-8">
              <div className="absolute -inset-1 bg-gradient-to-r from-[#F9703E] to-[#627D98] rounded-2xl blur opacity-30 group-hover:opacity-50 transition duration-1000"></div>
              <div className="relative bg-black rounded-2xl overflow-hidden shadow-2xl aspect-video border border-[#627D98]">
                <div className="absolute inset-0 bg-gradient-to-t from-[#334E68]/90 via-transparent to-[#334E68]/40 opacity-80 group-hover:opacity-100 transition-opacity duration-300" />
                
                <div className="absolute inset-0 flex items-center justify-center">
                  <button className="relative group/btn">
                    <div className="absolute inset-0 bg-[#F9703E] rounded-full blur-md opacity-40 group-hover/btn:opacity-60 transition-opacity"></div>
                    <div className="relative bg-[#F9703E] text-white p-5 lg:p-6 rounded-full transform transition-all duration-300 group-hover/btn:scale-110 shadow-lg">
                      <Play size={32} className="fill-white ml-1" />
                    </div>
                  </button>
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-6 text-white transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                  <div className="flex items-center gap-3 mb-2">
                      <span className="bg-[#F9703E]/90 backdrop-blur-sm text-[10px] font-bold px-3 py-1 rounded-full text-white uppercase tracking-wider shadow-sm">
                        Video Lección
                      </span>
                      <span className="text-[#BCCCDC] text-xs flex items-center gap-1">
                        <Clock size={12} /> 15:00 min
                      </span>
                  </div>
                  <h2 className="text-xl lg:text-2xl font-black mb-1 text-white tracking-tight">102. Configuración del entorno</h2>
                </div>
              </div>
            </div>

            {/* Panel de Tabs: Usando el color de las cards (#486581) */}
            <div className="bg-[#486581] rounded-2xl border border-[#627D98] overflow-hidden shadow-xl">
                
                <div className="flex p-2 gap-2 overflow-x-auto hide-scrollbar bg-[#334E68]/30">
                  {['overview', 'resources', 'reviews'].map((tab) => (
                    <button 
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`
                        px-6 py-2.5 text-sm font-medium rounded-xl transition-all duration-300 relative overflow-hidden flex-shrink-0
                        ${activeTab === tab 
                          ? 'text-white shadow-lg bg-[#334E68]/50 ring-1 ring-[#627D98]' 
                          : 'text-[#BCCCDC] hover:text-white hover:bg-white/5'
                        }
                      `}
                    >
                      {activeTab === tab && (
                        <div className="absolute inset-0 bg-gradient-to-r from-[#F9703E] to-[#ff8c61] opacity-100 -z-10"></div>
                      )}
                      {tab === 'overview' ? 'Descripción' : tab === 'resources' ? 'Recursos' : 'Reseñas'}
                    </button>
                  ))}
                </div>

                <div className="p-6 lg:p-8 min-h-[300px]">
                  {activeTab === 'overview' && (
                    <div className="animate-fade-in-up">
                      <h2 className="text-xl font-bold text-white mb-4">Sobre esta lección</h2>
                      <p className="text-[#F0F4F8] leading-relaxed text-base font-medium">
                        En esta lección aprenderemos a configurar todo el entorno de desarrollo necesario para trabajar con las APIs de OpenAI.
                      </p>
                      
                      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-5 rounded-xl bg-[#334E68]/50 border border-[#627D98] hover:border-[#F9703E]/50 transition-colors group">
                            <h4 className="font-semibold text-[#F9703E] text-sm mb-3 flex items-center gap-2">
                                <Star size={16} className="text-[#F9703E]" /> Lo que aprenderás
                            </h4>
                            <ul className="space-y-2">
                                {['Instalación de Node.js v18+', 'Gestión de API Keys seguras'].map((item, i) => (
                                  <li key={i} className="flex items-center gap-2 text-sm text-[#F0F4F8]">
                                    <div className="w-1.5 h-1.5 rounded-full bg-[#627D98] group-hover:bg-[#F9703E] transition-colors"></div>
                                    {item}
                                  </li>
                                ))}
                            </ul>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'resources' && (
                    <div className="space-y-3 animate-fade-in-up">
                      {[
                        { title: 'Guía de Instalación.pdf', size: '2.4 MB', icon: Wrench, color: 'text-[#F9703E]', bg: 'bg-[#F9703E]/10' },
                        { title: 'Repositorio de Código', size: 'Github Link', icon: FileText, color: 'text-blue-300', bg: 'bg-blue-500/10' }
                      ].map((res, idx) => (
                        <div key={idx} className="flex items-center justify-between p-4 bg-[#334E68]/50 border border-[#627D98] rounded-xl hover:bg-[#334E68] hover:border-[#F9703E]/50 transition-all cursor-pointer group">
                          <div className="flex items-center gap-4">
                            <div className={`w-12 h-12 rounded-xl ${res.bg} ${res.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                              <res.icon size={22} />
                            </div>
                            <div>
                              <p className="font-bold text-white text-sm">{res.title}</p>
                              <p className="text-xs text-[#BCCCDC] mt-1">{res.size}</p>
                            </div>
                          </div>
                          <button className="p-2 rounded-full hover:bg-white/10 text-[#BCCCDC] group-hover:text-[#F9703E] transition-colors">
                            <Download size={20} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {activeTab === 'reviews' && (
                    <div className="flex flex-col items-center justify-center py-12 text-center animate-fade-in-up">
                      <div className="w-16 h-16 bg-[#334E68]/50 rounded-full flex items-center justify-center mb-4">
                        <MessageCircle size={28} className="text-[#627D98]" />
                      </div>
                      <p className="text-[#F0F4F8] font-medium">Aún no hay comentarios</p>
                    </div>
                  )}
                </div>
            </div>
          </div>
        </div>

        {/* LADO DERECHO: Playlist (Sidebar) - Fondo idéntico al base */}
        <div className={`
          fixed lg:static inset-y-0 right-0 w-80 bg-[#334E68] border-l border-[#627D98] shadow-2xl lg:shadow-none transform transition-transform duration-300 z-40
          ${sidebarOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}
        `}>
          <div className="h-full flex flex-col">
            <div className="p-5 border-b border-[#627D98] bg-[#334E68] sticky top-0 z-10">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-bold text-white text-sm uppercase tracking-wider">Contenido</h3>
                <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-[#BCCCDC] hover:text-white">
                  <ChevronLeft size={20} className="rotate-180" />
                </button>
              </div>
              <p className="text-xs text-[#BCCCDC]">Tu progreso actual es bueno</p>
            </div>

            <div className="flex-1 overflow-y-auto hide-scrollbar">
              {course.modules.map((module) => (
                <div key={module.id} className="border-b border-[#627D98]/50 last:border-0">
                  <button 
                    onClick={() => toggleModule(module.id)}
                    className="w-full px-5 py-4 bg-[#334E68] hover:bg-[#486581] flex justify-between items-center transition-colors group"
                  >
                    <div>
                      <h4 className="font-bold text-sm text-[#F0F4F8] group-hover:text-white transition-colors text-left">{module.title}</h4>
                      <span className="text-[10px] text-[#BCCCDC] mt-1 block text-left">{module.duration}</span>
                    </div>
                    {expandedModules[module.id] ? 
                      <ChevronUp size={16} className="text-[#BCCCDC]" /> : 
                      <ChevronDown size={16} className="text-[#BCCCDC]" />
                    }
                  </button>
                  
                  <div className={`overflow-hidden transition-all duration-300 ${expandedModules[module.id] ? 'max-h-[500px]' : 'max-h-0'}`}>
                    {module.lessons.map((lesson) => {
                      const isActive = lesson.id === 102;
                      return (
                        <div 
                          key={lesson.id} 
                          className={`
                            px-5 py-3.5 flex gap-3 cursor-pointer transition-all border-l-4 relative
                            ${isActive 
                                ? 'bg-[#F9703E]/10 border-[#F9703E]' 
                                : 'bg-[#334E68] border-transparent hover:bg-[#486581] hover:border-[#627D98]'
                            }
                          `}
                        >
                          <div className="mt-0.5 flex-shrink-0 relative z-10">
                            {lesson.completed ? (
                              <CheckCircle size={18} className="text-[#48BB78]" />
                            ) : lesson.locked ? (
                              <Lock size={18} className="text-[#627D98]" />
                            ) : (
                              <div className={`w-[18px] h-[18px] rounded-full border-2 ${isActive ? 'border-[#F9703E]' : 'border-[#627D98]'}`} />
                            )}
                          </div>
                          
                          <div className="flex-1 relative z-10">
                            <p className={`text-sm font-medium leading-tight mb-1.5 ${isActive ? 'text-[#F9703E]' : 'text-[#F0F4F8]'}`}>
                              {lesson.title}
                            </p>
                            <div className="flex items-center gap-3 text-[11px] text-[#BCCCDC]">
                              <span className="flex items-center gap-1 bg-[#486581]/50 px-1.5 py-0.5 rounded border border-[#627D98]/50">
                                {lesson.type === 'video' ? <Play size={10} /> : <FileText size={10} />}
                                {lesson.type === 'video' ? 'Video' : 'Lectura'}
                              </span>
                              <span>{lesson.duration}</span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Overlay Móvil */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </div>
    </div>
  );
};

export default CourseDetailView;