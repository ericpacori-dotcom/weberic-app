// src/views/CourseDetailView.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Play, Clock, Award, CheckCircle, Lock, AlertTriangle, 
  ChevronDown, ChevronUp, Star, Share2, ShieldCheck, ArrowLeft 
} from 'lucide-react';
import { COLORS, formatCurrency, COURSE_PRICE } from '../utils/constants';
import { Button, Badge } from '../components/UI';

const CourseDetailView = ({ courses, user, handleLogin, handlePayment, handleLogout, userData, openRefundModal }) => {
  // 1. TODOS LOS HOOKS PRIMERO (SIEMPRE ARRIBA)
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [activeModule, setActiveModule] = useState(0);
  const [showShareTooltip, setShowShareTooltip] = useState(false);

  // 2. BUSCAMOS EL CURSO
  const course = courses.find(c => c.id === courseId);

  // 3. DETERMINAMOS SI EL USUARIO TIENE ACCESO
  const hasAccess = userData?.isSubscribed || userData?.purchasedCourses?.includes(courseId);

  // 4. SCROLL TO TOP AL CARGAR (HOOK)
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [courseId]);

  // 5. AHORA SÍ, VALIDAMOS SI EXISTE EL CURSO (DESPUÉS DE LOS HOOKS)
  if (!course) {
    return (
      <div className={`min-h-screen ${COLORS.bgMain} flex flex-col items-center justify-center p-4`}>
        <AlertTriangle size={48} className="text-[#F9703E] mb-4" />
        <h2 className={`text-2xl font-bold ${COLORS.textLight}`}>Curso no encontrado</h2>
        <Button onClick={() => navigate('/')} variant="secondary" className="mt-4">
          Volver al inicio
        </Button>
      </div>
    );
  }

  // LÓGICA DE LA VISTA
  const progress = 0; // Aquí podrías conectar con el progreso real si lo tuvieras

  return (
    <div className={`min-h-screen ${COLORS.bgMain} pb-20`}>
      {/* HEADER CON IMAGEN DE FONDO */}
      <div className="relative h-[40vh] md:h-[50vh] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-[#102A43] via-[#102A43]/80 to-transparent z-10" />
        <img 
          src={course.image} 
          alt={course.title} 
          className="w-full h-full object-cover"
        />
        
        {/* BARRA SUPERIOR */}
        <div className="absolute top-0 left-0 right-0 z-20 p-4 flex justify-between items-center">
            <button onClick={() => navigate('/')} className="p-2 bg-black/30 backdrop-blur-md rounded-full text-white hover:bg-white/20 transition-all">
                <ArrowLeft size={24} />
            </button>
            <div className="flex gap-2">
                {user ? (
                   <div className="flex items-center gap-2" onClick={handleLogout}>
                      <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#F9703E] to-[#FF4D4D] flex items-center justify-center text-xs font-bold text-white border-2 border-white/20">
                          {user.email[0].toUpperCase()}
                      </div>
                   </div>
                ) : (
                   <Button onClick={handleLogin} variant="secondary" className="text-xs px-3 py-1.5 h-auto">Login</Button>
                )}
            </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 z-20 p-6 md:p-12 max-w-7xl mx-auto">
          <Badge className="mb-4 bg-[#F9703E] text-white border-none shadow-lg shadow-[#F9703E]/20">
             {course.category || "Curso Premium"}
          </Badge>
          <h1 className="text-3xl md:text-5xl font-black text-white mb-4 leading-tight">
            {course.title}
          </h1>
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-300 font-medium">
             <div className="flex items-center gap-1"><Clock size={16} className="text-[#F9703E]"/> {course.duration || "4h 30m"}</div>
             <div className="flex items-center gap-1"><Star size={16} className="text-yellow-400 fill-yellow-400"/> 4.9 (520 reseñas)</div>
             <div className="flex items-center gap-1"><ShieldCheck size={16} className="text-green-400"/> Garantía de 7 días</div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 -mt-8 relative z-30">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* COLUMNA IZQUIERDA: CONTENIDO */}
            <div className="lg:col-span-2 space-y-8">
                
                {/* DESCRIPCIÓN */}
                <div className={`${COLORS.bgCard} p-6 rounded-3xl border border-[#486581]/30 shadow-xl`}>
                    <h3 className={`text-xl font-bold ${COLORS.textLight} mb-4 flex items-center gap-2`}>
                        <Award className="text-[#F9703E]" /> Lo que aprenderás
                    </h3>
                    <p className={`${COLORS.textMuted} leading-relaxed`}>
                        {course.description}
                        <br/><br/>
                        Domina las herramientas más avanzadas de IA para potenciar tu productividad y creatividad. Este curso está diseñado para llevarte de cero a experto en tiempo récord.
                    </p>
                </div>

                {/* TEMARIO / MÓDULOS */}
                <div className="space-y-4">
                    <h3 className={`text-xl font-bold ${COLORS.textLight} px-2`}>Contenido del Curso</h3>
                    {course.modules?.map((module, index) => (
                        <div key={index} className={`${COLORS.bgCard} rounded-2xl border border-[#486581]/30 overflow-hidden`}>
                            <button 
                                onClick={() => setActiveModule(activeModule === index ? -1 : index)}
                                className="w-full p-4 flex items-center justify-between hover:bg-[#1F364D] transition-colors"
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${activeModule === index ? 'bg-[#F9703E] text-white' : 'bg-[#334E68] text-[#BCCCDC]'}`}>
                                        {index + 1}
                                    </div>
                                    <span className={`font-bold ${COLORS.textLight}`}>{module.title}</span>
                                </div>
                                {activeModule === index ? <ChevronUp size={20} className={COLORS.textMuted}/> : <ChevronDown size={20} className={COLORS.textMuted}/>}
                            </button>
                            
                            {activeModule === index && (
                                <div className="bg-[#102A43]/50 p-4 space-y-2 border-t border-[#486581]/30">
                                    {module.lessons?.map((lesson, lIndex) => (
                                        <div key={lIndex} className="flex items-center justify-between p-3 rounded-xl hover:bg-[#1F364D] group cursor-pointer transition-all">
                                            <div className="flex items-center gap-3">
                                                <div className={`p-2 rounded-full ${hasAccess ? 'bg-[#00D97E]/10 text-[#00D97E]' : 'bg-[#334E68]/30 text-[#829AB1]'}`}>
                                                    {hasAccess ? <Play size={14} fill="currentColor" /> : <Lock size={14} />}
                                                </div>
                                                <span className={`${hasAccess ? 'text-white' : COLORS.textMuted} text-sm font-medium`}>
                                                    {lesson}
                                                </span>
                                            </div>
                                            <span className="text-xs text-[#829AB1] font-bold">10:00</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* COLUMNA DERECHA: TARJETA DE COMPRA */}
            <div className="lg:col-span-1">
                <div className={`sticky top-24 ${COLORS.bgCard} p-6 rounded-3xl border border-[#486581]/50 shadow-2xl relative overflow-hidden`}>
                    {/* Efecto de brillo */}
                    <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#F9703E]/20 blur-3xl rounded-full pointer-events-none"></div>

                    {hasAccess ? (
                        <div className="text-center space-y-6">
                            <div className="w-20 h-20 mx-auto bg-[#00D97E]/10 rounded-full flex items-center justify-center mb-4 border border-[#00D97E]/30">
                                <CheckCircle size={40} className="text-[#00D97E]" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-black text-white mb-2">¡Ya tienes acceso!</h3>
                                <p className={COLORS.textMuted}>Disfruta de tu aprendizaje sin límites.</p>
                            </div>
                            <Button className="w-full py-4 text-lg shadow-[#00D97E]/20 shadow-lg border border-[#00D97E]/50 text-[#00D97E] hover:bg-[#00D97E] hover:text-[#102A43]">
                                Continuar Aprendiendo
                            </Button>
                        </div>
                    ) : (
                        <>
                            <div className="mb-6">
                                <span className="text-[#BCCCDC] text-sm font-bold uppercase tracking-widest">Precio Total</span>
                                <div className="flex items-end gap-2 mt-1">
                                    <span className="text-4xl font-black text-white">{formatCurrency(COURSE_PRICE)}</span>
                                    <span className="text-[#829AB1] line-through font-bold mb-1 text-lg">$99.99</span>
                                </div>
                                <div className="mt-2 inline-flex items-center gap-1 bg-[#F9703E]/10 text-[#F9703E] px-2 py-1 rounded-md text-xs font-bold border border-[#F9703E]/30">
                                    <ZapIcon size={12} /> 80% DE DESCUENTO
                                </div>
                            </div>

                            <div className="space-y-3 mb-8">
                                <Button onClick={() => handlePayment(course)} variant="primary" className="w-full py-4 text-lg shadow-xl shadow-[#F9703E]/20 group relative overflow-hidden">
                                    <span className="relative z-10 flex items-center justify-center gap-2">
                                        Desbloquear Curso <ArrowRightIcon className="group-hover:translate-x-1 transition-transform" />
                                    </span>
                                </Button>
                                <p className="text-center text-xs text-[#829AB1]">Pago único • Acceso de por vida</p>
                            </div>

                            <div className="border-t border-[#486581]/30 pt-6 space-y-4">
                                <div className="flex items-center gap-3 text-sm text-[#BCCCDC]">
                                    <CheckCircle size={16} className="text-[#00D97E]" /> Acceso inmediato al contenido
                                </div>
                                <div className="flex items-center gap-3 text-sm text-[#BCCCDC]">
                                    <CheckCircle size={16} className="text-[#00D97E]" /> Certificado de finalización
                                </div>
                                <div className="flex items-center gap-3 text-sm text-[#BCCCDC]">
                                    <CheckCircle size={16} className="text-[#00D97E]" /> Soporte prioritario
                                </div>
                            </div>
                            
                            <button onClick={openRefundModal} className="w-full mt-6 text-xs text-[#829AB1] hover:text-white underline text-center">
                                Política de reembolso de 30 días
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

// Iconos auxiliares simples para evitar errores de importación si faltan en lucide
const ZapIcon = ({className, size}) => <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>;
const ArrowRightIcon = ({className}) => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>;

export default CourseDetailView;