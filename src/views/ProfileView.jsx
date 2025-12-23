// src/views/ProfileView.jsx
import React from 'react';
import { ChevronRight, LogOut, Crown, BookOpen, CheckCircle, Package, PlayCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { Button, Badge } from '../components/UI';
import { COLORS } from '../utils/constants';

const ProfileView = ({ user, userData, courses, handleLogout }) => {
  const navigate = useNavigate();
  const myCourses = courses.filter(course => userData?.purchasedCourses?.includes(course.id));

  return (
    <div className={`min-h-screen pb-20 font-sans ${COLORS.textLight} animate-fade-in-up overflow-x-hidden relative z-10`}>
      <Navbar user={user} userData={userData} handleLogout={handleLogout} />
      
      <div className={`relative pt-10 pb-20 px-6 border-b border-[#486581] z-10 bg-[#334E68]/95 backdrop-blur-sm shadow-sm`}>
        <div className="max-w-4xl mx-auto relative z-10 animate-fade-in-up">
           <button onClick={() => navigate('/')} className={`group inline-flex items-center ${COLORS.textMuted} hover:text-white font-bold ${COLORS.bgCard} px-3 py-1.5 rounded-full mb-6 transition-all border border-[#627D98] hover:border-[#F9703E] hover:-translate-x-1 text-[10px] uppercase tracking-wider`}><ChevronRight size={12} className="mr-1 rotate-180" /> Volver</button>
           <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
              <img src={user?.photoURL} alt="Profile" className="w-24 h-24 rounded-full border-4 border-[#F9703E] shadow-2xl" />
              <div className="text-center md:text-left">
                <h1 className={`text-3xl font-black mb-1 tracking-tight ${COLORS.textLight}`}>{user?.displayName || "Usuario"}</h1>
                <p className={`${COLORS.textMuted} font-medium mb-4`}>{user?.email}</p>
                <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                  {userData?.isSubscribed ? <Badge color="orange"><Crown size={12} className="inline mr-1 mb-0.5 animate-pulse"/> MIEMBRO PREMIUM</Badge> : <Badge color="blue">CUENTA GRATUITA</Badge>}
                  <button onClick={handleLogout} className="text-xs font-bold text-[#EF4444] hover:text-red-300 flex items-center gap-1 transition-colors ml-4"><LogOut size={14}/> Cerrar Sesión</button>
                </div>
              </div>
           </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 -mt-10 relative z-20 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
           <div className={`${COLORS.bgCard} p-6 rounded-3xl border border-[#627D98] shadow-lg flex items-center gap-4`}>
              <div className="p-3 bg-[#F9703E]/20 rounded-full text-[#F9703E]"><Crown size={24}/></div>
              <div><p className="text-xs text-[#BCCCDC] font-bold uppercase tracking-wider">Membresía</p><h3 className="text-xl font-black text-white">{userData?.isSubscribed ? "Activa" : "Inactiva"}</h3></div>
           </div>
           <div className={`${COLORS.bgCard} p-6 rounded-3xl border border-[#627D98] shadow-lg flex items-center gap-4`}>
              <div className="p-3 bg-[#48BB78]/20 rounded-full text-[#48BB78]"><Package size={24}/></div>
              <div><p className="text-xs text-[#BCCCDC] font-bold uppercase tracking-wider">Cursos Adquiridos</p><h3 className="text-xl font-black text-white">{userData?.isSubscribed ? "Acceso Total" : `${myCourses.length} Cursos`}</h3></div>
           </div>
        </div>
        
        <h2 className="text-2xl font-black mb-6 flex items-center gap-2"><BookOpen className={COLORS.textOrange}/> Mis Cursos</h2>
        
        {userData?.isSubscribed ? (
           <div className={`${COLORS.bgMain} border border-[#F9703E] p-8 rounded-3xl text-center shadow-2xl relative overflow-hidden group`}>
             <Crown size={48} className="text-[#F9703E] mx-auto mb-4 animate-bounce-slow"/>
             <h3 className="text-xl font-black text-white mb-2">¡Tienes Acceso Total!</h3>
             <Button onClick={() => navigate('/')}>Ir al Catálogo</Button>
           </div>
        ) : myCourses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {myCourses.map(course => (
              <div key={course.id} onClick={() => navigate(`/curso/${course.id}`)} className={`${COLORS.bgCard} p-4 rounded-3xl border border-[#627D98] shadow-lg flex gap-4 items-center hover:border-[#F9703E] hover:scale-[1.02] transition-all group cursor-pointer active:scale-95`}>
                 <div className="relative w-20 h-20 flex-shrink-0"><img src={course.image} alt={course.title} className="w-full h-full rounded-2xl object-cover bg-[#334E68]" /><div className="absolute inset-0 bg-black/30 rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"><PlayCircle className="text-white" size={24} /></div></div>
                 <div><Badge color="light" className="mb-2 inline-block text-[10px] px-2 py-0.5">{course.category}</Badge><h4 className="font-bold text-sm leading-tight mb-2 line-clamp-2 group-hover:text-[#F9703E] transition-colors">{course.title}</h4></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 border-2 border-dashed border-[#627D98] rounded-3xl opacity-60"><p className="text-[#BCCCDC] font-bold">No has comprado cursos individuales.</p></div>
        )}
      </div>
    </div>
  );
};
export default ProfileView;