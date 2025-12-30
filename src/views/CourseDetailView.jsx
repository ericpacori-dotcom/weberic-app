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

  return (
    // CAMBIO: Fondo Azul Agua Claro (#0e7490 - Cian 700)
    <div className="flex flex-col h-screen bg-[#0e7490] text-cyan-50 font-sans selection:bg-orange-500 selection:text-white">
      
      {/* Estilos para ocultar scrollbars */}
      <style>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>

      {/* HEADER: Glassmorphism más claro y brillante */}
      <header className="h-16 px-4 lg:px-6 flex items-center justify-between z-30 sticky top-0 bg-[#0e7490]/80 backdrop-blur-md border-b border-cyan-600/30">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate(-1)} 
            className="p-2 -ml-2 text-cyan-200 hover:text-orange-400 hover:bg-white/10 rounded-full transition-all"
          >
            <ChevronLeft size={24} />
          </button>
          
          <h1 className="text-base lg:text-lg font-bold text-cyan-50 truncate max-w-[200px] lg:max-w-md leading-tight tracking-wide">
            {course.title}
          </h1>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-3 bg-cyan-800/30 py-1.5 px-3 rounded-full border border-cyan-600/30">
            <div className="flex flex-col items-end">
               <span className="text-[10px] font-bold text-orange-400 leading-none">{course.progress}%</span>
            </div>
            <div className="w-20 bg-cyan-900/50 rounded-full h-1.5 overflow-hidden">
              <div 
                className="bg-orange-500 h-full rounded-full shadow-[0_0_8px_rgba(249,115,22,0.6)] transition-all duration-500" 
                style={{ width: `${course.progress}%` }}
              ></div>
            </div>
          </div>
          
          <button className="hidden sm:flex items-center gap-2 px-4 py-2 text-sm font-medium text-cyan-100 bg-white/10 border border-white/20 rounded-xl hover:bg-orange-500 hover:text-white hover:border-orange-500 transition-all duration-300">
            <Share2 size={18} />
            <span>Compartir</span>
          </button>
          
          <button 
            className="lg:hidden p-2 text-cyan-100 hover:bg-white/10 rounded-lg"
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
              <div className="absolute -inset-1 bg-gradient-to-r from-orange-600 to-cyan-400 rounded-2xl blur opacity-30 group-hover:opacity-50 transition duration-1000"></div>
              <div className="relative bg-black rounded-2xl overflow-hidden shadow-2xl aspect-video border border-cyan-600/30">
                {/* Gradiente ajustado al nuevo fondo azul agua */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0e7490]/90 via-transparent to-[#0e7490]/40 opacity-80 group-hover:opacity-100 transition-opacity duration-300" />
                
                <div className="absolute inset-0 flex items-center justify-center">
                  <button className="relative group/btn">
                    <div className="absolute inset-0 bg-orange-500 rounded-full blur-md opacity-40 group-hover/btn:opacity-60 transition-opacity"></div>
                    <div className="relative bg-orange-500 text-white p-5 lg:p-6 rounded-full transform transition-all duration-300 group-hover/btn:scale-110 shadow-lg">
                      <Play size={32} className="fill-white ml-1" />
                    </div>
                  </button>
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-6 text-white transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                  <div className="flex items-center gap-3 mb-2">
                      <span className="bg-orange-500/90 backdrop-blur-sm text-[10px] font-bold px-3 py-1 rounded-full text-white uppercase tracking-wider shadow-sm">
                        Video Lección
                      </span>
                      <span className="text-cyan-100 text-xs flex items-center gap-1">
                        <Clock size={12} /> 15:00 min
                      </span>
                  </div>
                  <h2 className="text-xl lg:text-2xl font-bold mb-1 text-cyan-50 tracking-tight">102. Configuración del entorno</h2>
                </div>
              </div>
            </div>

            {/* Panel de Tabs: Tarjetas cian transparentes */}
            <div className="bg-cyan-800/20 backdrop-blur-sm rounded-2xl border border-cyan-600/30 overflow-hidden shadow-lg shadow-cyan-900/10">
                
                <div className="flex p-2 gap-2 overflow-x-auto hide-scrollbar">
                  {['overview', 'resources', 'reviews'].map((tab) => (
                    <button 
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`
                        px-6 py-2.5 text-sm font-medium rounded-xl transition-all duration-300 relative overflow-hidden flex-shrink-0
                        ${activeTab === tab 
                          ? 'text-white shadow-lg bg-cyan-700/50' 
                          : 'text-cyan-300 hover:text-cyan-100 hover:bg-white/10'
                        }
                      `}
                    >
                      {activeTab === tab && (
                        <div className="absolute inset-0 bg-gradient-to-r from-orange-600 to-orange-500 opacity-100 -z-10"></div>
                      )}
                      {tab === 'overview' ? 'Descripción' : tab === 'resources' ? 'Recursos' : 'Reseñas'}
                    </button>
                  ))}
                </div>

                <div className="p-6 lg:p-8 min-h-[300px]">
                  {activeTab === 'overview' && (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                      <h2 className="text-xl font-bold text-cyan-50 mb-4">Sobre esta lección</h2>
                      <p className="text-cyan-200 leading-relaxed text-base font-light">
                        En esta lección aprenderemos a configurar todo el entorno de desarrollo necesario para trabajar con las APIs de OpenAI.
                      </p>
                      
                      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-5 rounded-xl bg-cyan-800/30 border border-cyan-600/30 hover:border-orange-500/30 transition-colors group">
                            <h4 className="font-semibold text-orange-400 text-sm mb-3 flex items-center gap-2">
                                <Star size={16} className="text-orange-500" /> Lo que aprenderás
                            </h4>
                            <ul className="space-y-2">
                                {['Instalación de Node.js v18+', 'Gestión de API Keys seguras'].map((item, i) => (
                                  <li key={i} className="flex items-center gap-2 text-sm text-cyan-200">
                                    <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 group-hover:bg-orange-500 transition-colors"></div>
                                    {item}
                                  </li>
                                ))}
                            </ul>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'resources' && (
                    <div className="space-y-3 animate-in fade-in slide-in-from-bottom-4 duration-500">
                      {[
                        { title: 'Guía de Instalación.pdf', size: '2.4 MB', icon: Wrench, color: 'text-orange-400', bg: 'bg-orange-500/10' },
                        { title: 'Repositorio de Código', size: 'Github Link', icon: FileText, color: 'text-blue-300', bg: 'bg-blue-500/10' }
                      ].map((res, idx) => (
                        <div key={idx} className="flex items-center justify-between p-4 bg-cyan-800/30 border border-cyan-600/30 rounded-xl hover:bg-cyan-800/50 hover:border-orange-500/50 transition-all cursor-pointer group">
                          <div className="flex items-center gap-4">
                            <div className={`w-12 h-12 rounded-xl ${res.bg} ${res.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                              <res.icon size={22} />
                            </div>
                            <div>
                              <p className="font-bold text-cyan-100 text-sm">{res.title}</p>
                              <p className="text-xs text-cyan-400 mt-1">{res.size}</p>
                            </div>
                          </div>
                          <button className="p-2 rounded-full hover:bg-white/10 text-cyan-300 group-hover:text-orange-500 transition-colors">
                            <Download size={20} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {activeTab === 'reviews' && (
                    <div className="flex flex-col items-center justify-center py-12 text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
                      <div className="w-16 h-16 bg-cyan-800/30 rounded-full flex items-center justify-center mb-4">
                        <MessageCircle size={28} className="text-cyan-400" />
                      </div>
                      <p className="text-cyan-300 font-medium">Aún no hay comentarios</p>
                    </div>
                  )}
                </div>
            </div>
          </div>
        </div>

        {/* LADO DERECHO: Playlist (Sidebar) - Fondo azul agua */}
        <div className={`
          fixed lg:static inset-y-0 right-0 w-80 bg-[#0e7490] border-l border-cyan-600/30 shadow-2xl lg:shadow-none transform transition-transform duration-300 z-40
          ${sidebarOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}
        `}>
          <div className="h-full flex flex-col">
            <div className="p-5 border-b border-cyan-600/30 bg-[#0e7490] sticky top-0 z-10">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-bold text-cyan-50 text-sm uppercase tracking-wider">Contenido del Curso</h3>
                <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-cyan-200 hover:text-white">
                  <ChevronLeft size={20} className="rotate-180" />
                </button>
              </div>
              <p className="text-xs text-cyan-300">Tu progreso actual es bueno</p>
            </div>

            <div className="flex-1 overflow-y-auto hide-scrollbar">
              {course.modules.map((module) => (
                <div key={module.id} className="border-b border-cyan-600/20 last:border-0">
                  <button 
                    onClick={() => toggleModule(module.id)}
                    className="w-full px-5 py-4 bg-cyan-800/20 hover:bg-cyan-800/40 flex justify-between items-center transition-colors group"
                  >
                    <div>
                      <h4 className="font-bold text-sm text-cyan-200 group-hover:text-white transition-colors text-left">{module.title}</h4>
                      <span className="text-[10px] text-cyan-400 mt-1 block text-left">{module.duration}</span>
                    </div>
                    {expandedModules[module.id] ? 
                      <ChevronUp size={16} className="text-cyan-400" /> : 
                      <ChevronDown size={16} className="text-cyan-400" />
                    }
                  </button>
                  
                  <div className={`overflow-hidden transition-all duration-300 ${expandedModules[module.id] ? 'max-h-[500px]' : 'max-h-0'}`}>
                    {module.lessons.map((lesson) => {
                      const isActive = lesson.id === 102;
                      return (
                        <div 
                          key={lesson.id} 
                          className={`
                            px-5 py-3.5 flex gap-3 cursor-pointer transition-all border-l-2 relative
                            ${isActive 
                                ? 'bg-orange-500/10 border-orange-500' 
                                : 'bg-transparent border-transparent hover:bg-cyan-800/30 hover:border-cyan-600'
                            }
                          `}
                        >
                          <div className="mt-0.5 flex-shrink-0 relative z-10">
                            {lesson.completed ? (
                              <CheckCircle size={18} className="text-emerald-400" />
                            ) : lesson.locked ? (
                              <Lock size={18} className="text-cyan-500" />
                            ) : (
                              <div className={`w-[18px] h-[18px] rounded-full border-2 ${isActive ? 'border-orange-500' : 'border-cyan-500'}`} />
                            )}
                          </div>
                          
                          <div className="flex-1 relative z-10">
                            <p className={`text-sm font-medium leading-tight mb-1.5 ${isActive ? 'text-orange-400' : 'text-cyan-200 group-hover:text-cyan-50'}`}>
                              {lesson.title}
                            </p>
                            <div className="flex items-center gap-3 text-[11px] text-cyan-400">
                              <span className="flex items-center gap-1 bg-cyan-800/40 px-1.5 py-0.5 rounded border border-cyan-600/30">
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