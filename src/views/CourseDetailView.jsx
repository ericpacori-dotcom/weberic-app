// src/views/CourseDetailView.jsx
import React, { useState } from 'react';
import { 
  ChevronRight, Sparkles, CalendarCheck, BookOpen, PenTool, ChevronDown, CheckCircle, ExternalLink, Video, AlertTriangle
} from 'lucide-react';
import Navbar from '../components/Navbar';
import { Badge } from '../components/UI';
import { COLORS } from '../utils/constants';

const CourseDetailView = ({ selectedCourse, isRich, setView, user, handleLogin, handlePayment, handleLogout, userData, openRefundModal, goBack }) => {
  const [activeTab, setActiveTab] = useState(isRich ? 'plan' : 'video');
  const [expandedWeek, setExpandedWeek] = useState(null);
  const isOwned = userData?.purchasedCourses?.includes(selectedCourse?.id) || userData?.isSubscribed;

  return (
    <div className={`min-h-screen pb-20 font-sans ${COLORS.textLight} animate-fade-in-up overflow-x-hidden relative z-10`}>
      <Navbar user={user} userData={userData} setView={setView} handleLogin={handleLogin} handleLogout={handleLogout} />
      
      <div className={`relative pt-20 pb-36 px-6 border-b border-[#486581] z-10 bg-[#334E68]/80 backdrop-blur-sm`}>
        <div className="max-w-5xl mx-auto text-center relative z-10 animate-fade-in-up">
          <button onClick={goBack} className={`group flex items-center ${COLORS.textMuted} hover:text-white font-bold ${COLORS.bgCard} px-5 py-2.5 rounded-full mb-8 mx-auto transition-all border border-[#627D98] hover:border-[#F9703E] hover:-translate-x-1`}><ChevronRight size={18} className="mr-2 rotate-180" /> Volver</button>
          
          <div className="flex flex-wrap gap-3 mb-6 justify-center">
            <Badge color="light">{selectedCourse.category}</Badge>
            {isRich && <Badge color="orange"><Sparkles size={12} className="mr-1 inline-block animate-spin-slow"/> PREMIUM</Badge>}
          </div>
          <h1 className={`text-4xl md:text-6xl font-black mb-6 tracking-tight ${COLORS.textLight} leading-tight drop-shadow-xl`}>{selectedCourse.title}</h1>
          <p className={`${COLORS.textMuted} text-lg max-w-3xl mx-auto font-medium opacity-90 leading-relaxed`}>{selectedCourse.longDescription || selectedCourse.description}</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 -mt-24 relative z-20 animate-fade-in-up" style={{animationDelay: '0.2s'}}>
        <div className={`${COLORS.bgCard} rounded-[3rem] border border-[#627D98] shadow-2xl overflow-hidden min-h-[600px] p-2 bg-opacity-95 backdrop-blur-xl`}>
          <div className={`flex flex-wrap justify-center gap-2 p-3 ${COLORS.bgMain} rounded-[2.5rem] mb-6 mx-2 mt-2 border border-[#486581]`}>
            {isRich ? (
              <>
                {['plan', 'syllabus', 'tools'].map((tab) => (
                  <button key={tab} onClick={() => setActiveTab(tab)} className={`py-3 px-8 rounded-full text-sm font-bold flex gap-2 items-center transition-all duration-300 ${activeTab === tab ? `${COLORS.accentOrange} text-white shadow-md scale-105` : `${COLORS.textMuted} hover:text-white hover:bg-[#486581]`}`}>
                    {tab === 'plan' && <CalendarCheck size={18}/>}
                    {tab === 'syllabus' && <BookOpen size={18}/>}
                    {tab === 'tools' && <PenTool size={18}/>}
                    {tab === 'plan' ? 'Plan' : tab === 'syllabus' ? 'Temario' : 'Herramientas'}
                  </button>
                ))}
              </>
            ) : (
              <button className={`py-3 px-8 rounded-full font-bold ${COLORS.accentOrange} text-white shadow-md`}>Video Clase</button>
            )}
          </div>

          <div className="p-8 md:p-12 h-full">
            {activeTab === 'plan' && isRich && (
              <div className="space-y-5 max-w-3xl mx-auto">
                {selectedCourse.actionPlan.map((week, index) => (
                  <div key={week.week} className={`group ${COLORS.bgMain} border ${expandedWeek === week.week ? 'border-[#F9703E] shadow-md' : 'border-[#486581]'} rounded-2xl overflow-hidden transition-all duration-300 animate-fade-in-up`} style={{animationDelay: `${index * 0.1}s`}}>
                    <div onClick={() => setExpandedWeek(expandedWeek === week.week ? null : week.week)} className={`p-6 flex items-center justify-between cursor-pointer hover:bg-[#486581]/50 transition-colors`}>
                      <div className="flex items-center gap-6">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-black text-xl transition-all ${expandedWeek === week.week ? `${COLORS.accentOrange} text-white rotate-3 scale-110` : `${COLORS.bgCard} ${COLORS.textMuted} border border-[#627D98]`}`}>{week.week}</div>
                        <div><p className={`text-[10px] ${COLORS.textOrange} uppercase font-bold tracking-widest mb-1`}>Semana {week.week}</p><h4 className={`font-bold ${COLORS.textLight} text-lg`}>{week.title}</h4></div>
                      </div>
                      <ChevronDown size={24} className={`${COLORS.textMuted} transition-transform duration-300 ${expandedWeek === week.week ? `rotate-180 ${COLORS.textOrange}` : ''}`}/>
                    </div>
                    {expandedWeek === week.week && <div className={`px-6 pb-8 pt-2 border-t border-[#486581] animate-fade-in-up`}><ul className="space-y-4">{week.tasks.map((task, i) => <li key={i} className={`flex items-start gap-4 ${COLORS.textLight} text-sm font-medium`}><CheckCircle size={20} className={`${COLORS.textOrange} flex-shrink-0 mt-0.5`} /><span>{task}</span></li>)}</ul></div>}
                  </div>
                ))}
              </div>
            )}
            {activeTab === 'syllabus' && isRich && (
              <div className="space-y-8 max-w-3xl mx-auto">
                {selectedCourse.syllabus.map((mod, i) => (
                  <div key={i} className={`${COLORS.bgMain} p-8 rounded-[2rem] border border-[#486581] shadow-lg hover:border-[#627D98] transition-all animate-fade-in-up`} style={{animationDelay: `${i * 0.1}s`}}>
                    <h3 className={`font-bold text-xl ${COLORS.textLight} mb-6 flex items-center gap-4`}><span className={`${COLORS.accentOrange} text-white w-10 h-10 rounded-xl flex items-center justify-center text-base font-black shadow-sm`}>{i+1}</span>{mod.title}</h3>
                    <div className={`space-y-6 pl-5 border-l-2 border-[#627D98] ml-5`}>{mod.content.map((item, j) => (<div key={j} className="relative pl-6"><div className={`absolute left-[-0.4rem] top-1.5 w-3 h-3 rounded-full ${COLORS.accentOrange}`}></div><h5 className={`font-bold ${COLORS.textLight} text-lg mb-2`}>{item.subtitle}</h5><p className={`${COLORS.textMuted} leading-relaxed text-sm ${COLORS.bgCard} p-4 rounded-xl border border-[#486581]`}>{item.text}</p></div>))}</div>
                  </div>
                ))}
              </div>
            )}
            {activeTab === 'tools' && isRich && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                {selectedCourse.tools.map((tool, i) => (
                  <a key={i} href={tool.link} target="_blank" rel="noopener noreferrer" className={`${COLORS.bgMain} p-6 rounded-2xl border border-[#486581] hover:border-[#F9703E] transition-all duration-300 group flex items-start gap-5 hover:-translate-y-2 shadow-md hover:shadow-2xl animate-fade-in-up`} style={{animationDelay: `${i * 0.1}s`}}>
                    <div className={`${COLORS.bgCard} p-4 rounded-xl group-hover:${COLORS.accentOrange} transition-colors border border-[#627D98] duration-300`}><PenTool size={24} className={`${COLORS.textMuted} group-hover:text-white transition-colors`}/></div>
                    <div><h4 className={`font-bold ${COLORS.textLight} text-lg flex items-center gap-2 mb-2 group-hover:${COLORS.textOrange} transition-colors`}>{tool.name} <ExternalLink size={16} className="opacity-50"/></h4><p className={`${COLORS.textMuted} text-sm`}>{tool.desc}</p></div>
                  </a>
                ))}
              </div>
            )}
            {(!isRich || activeTab === 'video') && <div className="flex flex-col items-center justify-center text-center h-full py-24 animate-fade-in-up"><div className={`${COLORS.bgMain} p-10 rounded-full mb-8 text-[#627D98] border border-[#486581] animate-float`}><Video size={60}/></div><h3 className={`font-bold text-2xl ${COLORS.textLight} mb-3`}>Video Introductorio</h3><p className={COLORS.textMuted}>Contenido próximamente.</p></div>}
          </div>
          
          {isOwned && (
            <div className="flex justify-center mt-12 mb-4 animate-fade-in-up">
              <button onClick={openRefundModal} className="flex items-center gap-2 text-sm font-bold text-[#BCCCDC] hover:text-[#EF4444] transition-colors opacity-70 hover:opacity-100">
                <AlertTriangle size={16} /> ¿Problemas con el curso? Solicitar Reembolso
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseDetailView;