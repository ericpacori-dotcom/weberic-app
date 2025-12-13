import React, { useState, useEffect } from 'react';
import { 
  Play, Lock, CheckCircle, Star, Menu, X, User, 
  TrendingUp, Award, ChevronRight, Loader, LogOut, Video,
  CalendarCheck, PenTool, BookOpen, ExternalLink, ChevronDown, ChevronUp, Briefcase, ArrowRight, Sparkles, Search, Trash2, RefreshCw
} from 'lucide-react';

// FIREBASE IMPORTS
import { db, auth, googleProvider } from './firebase';
import { 
  collection, getDocs, doc, setDoc, updateDoc, arrayUnion, onSnapshot, query, where, writeBatch, deleteDoc
} from 'firebase/firestore';
import { signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';

// --- IMPORTAMOS LOS 15 CURSOS ---
import { ALL_COURSES } from './content/courses_data';

// --- COMPONENTES UI REUTILIZABLES ---

const Button = ({ children, onClick, variant = 'primary', className = '', disabled = false }) => {
  const baseStyle = "px-8 py-3 rounded-full font-bold transition-all duration-300 ease-in-out flex items-center justify-center gap-2 text-sm tracking-wide transform hover:-translate-y-1 active:translate-y-0";
  const variants = {
    primary: "bg-gradient-to-r from-orange-400 to-pink-500 text-white hover:shadow-xl hover:shadow-orange-500/30",
    secondary: "bg-white text-slate-700 border-2 border-orange-100 hover:border-orange-300 hover:bg-orange-50/50 hover:shadow-md",
    outline: "border-2 border-orange-400 text-orange-500 hover:bg-orange-50",
    google: "bg-white text-slate-700 border-2 border-slate-200 hover:border-orange-300 hover:bg-orange-50/30 hover:shadow-md", 
    danger: "bg-red-500 text-white hover:bg-red-600 hover:shadow-red-500/30",
    warning: "bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:shadow-lg hover:shadow-purple-500/30"
  };
  return (
    <button onClick={onClick} disabled={disabled} className={`${baseStyle} ${variants[variant]} ${disabled ? 'opacity-60 cursor-not-allowed hover:translate-y-0 hover:shadow-none' : ''} ${className}`}>
      {children}
    </button>
  );
};

const Badge = ({ children, color = 'peach', className = '' }) => {
  const colors = { 
    peach: 'bg-orange-100 text-orange-700', 
    teal: 'bg-teal-100 text-teal-800', 
    blue: 'bg-blue-100 text-blue-700',
    purple: 'bg-purple-100 text-purple-700',
  };
  return <span className={`px-4 py-1.5 rounded-full text-xs font-extrabold tracking-wider uppercase ${colors[color]} ${className}`}>{children}</span>;
};

// --- COMPONENTE NAVBAR ---
// Lo definimos fuera para evitar re-renders innecesarios
const Navbar = ({ user, userData, setView, handleLogin, handleLogout, resetDatabase }) => (
  <nav className="sticky top-0 z-50 bg-white/70 backdrop-blur-xl border-b border-orange-100/50 py-2">
    <div className="max-w-7xl mx-auto px-6 flex justify-between items-center h-20">
      <div className="flex items-center gap-3 cursor-pointer group" onClick={() => setView('home')}>
        <div className="bg-gradient-to-tr from-orange-400 to-pink-500 p-3 rounded-2xl shadow-lg shadow-orange-200 group-hover:shadow-orange-300 group-hover:scale-110 transition-all duration-300">
          <TrendingUp size={26} className="text-white" />
        </div>
        <span className="font-black text-2xl text-slate-800 tracking-tight">
          Emprende<span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-pink-500">Pro</span>
        </span>
      </div>
      <div className="flex items-center gap-4">
        <Button 
          onClick={resetDatabase} 
          variant="danger" 
          className="hidden md:flex text-xs py-2 px-4 bg-red-500 border-none"
        >
           <RefreshCw size={14}/> RESET DB
        </Button>

        {user ? (
          <div className="flex items-center gap-4 bg-white p-2 pr-4 rounded-full border-2 border-orange-100 shadow-sm">
            <img src={user.photoURL} className="w-10 h-10 rounded-full border-2 border-white shadow-sm" alt="user" />
            {userData.isSubscribed && <div className="hidden md:flex bg-gradient-to-r from-amber-400 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-sm">PRO</div>}
            <button onClick={handleLogout} className="text-slate-400 hover:text-red-400 transition-all hover:bg-red-50 p-2 rounded-full"><LogOut size={20}/></button>
          </div>
        ) : (
          <Button onClick={handleLogin} variant="google" className="text-sm font-bold">
            <User size={18} className="text-orange-500"/> Iniciar Sesión
          </Button>
        )}
      </div>
    </div>
  </nav>
);

// --- COMPONENTE HOME VIEW ---
// Recibe props en lugar de usar variables globales
const HomeView = ({ 
  courses, loadingCourses, userData, user, handleCourseClick, 
  searchTerm, setSearchTerm, // Props del buscador
  setView, handleLogin, handleLogout, resetDatabase 
}) => {
  
  // Lógica de filtrado dentro del componente Home
  const filteredCourses = courses.filter(course => 
    course.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    course.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="pb-20 bg-orange-50/30 min-h-screen font-sans animate-fade-in-up">
      <Navbar user={user} userData={userData} setView={setView} handleLogin={handleLogin} handleLogout={handleLogout} resetDatabase={resetDatabase} />
      
      <div className="relative py-24 px-6 text-center overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-gradient-to-br from-orange-200 to-pink-200 rounded-full blur-3xl opacity-60 animate-pulse-soft"></div>
        <div className="absolute bottom-[10%] right-[-5%] w-[30%] h-[50%] bg-gradient-to-tl from-teal-200 to-blue-200 rounded-full blur-3xl opacity-60 animate-pulse-soft" style={{animationDelay: '2s'}}></div>
        <div className="max-w-5xl mx-auto relative z-10">
          <Badge color="peach" className="mb-6 inline-block shadow-sm"><Sparkles size={14} className="inline mr-1"/> CATÁLOGO PREMIUM</Badge>
          <h1 className="text-6xl md:text-7xl font-black mb-8 tracking-tight leading-tight text-slate-900">
            Emprende con IA <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-pink-500 to-teal-500">desde hoy.</span>
          </h1>
          <p className="text-slate-600 text-2xl max-w-3xl mx-auto mb-12 leading-relaxed font-medium">
            15 Modelos de negocio validados listos para copiar y pegar.
          </p>

          {/* --- BARRA DE BÚSQUEDA INTELIGENTE --- */}
          <div className="max-w-xl mx-auto relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-6 w-6 text-slate-400 group-focus-within:text-orange-500 transition-colors" />
            </div>
            <input 
              type="text" 
              placeholder="Buscar curso (ej: YouTube, Dropshipping, Ebooks...)"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-5 rounded-full border-2 border-white bg-white/80 backdrop-blur-md shadow-xl text-lg font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-orange-300 focus:ring-4 focus:ring-orange-100 transition-all"
            />
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-6 py-12">
        {loadingCourses ? <div className="flex justify-center py-20"><div className="bg-white p-8 rounded-full shadow-xl"><Loader className="animate-spin text-orange-500" size={50}/></div></div> : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
            {filteredCourses.length > 0 ? filteredCourses.map((course) => {
               const price = Number(course.price) || 0;
               const isUnlocked = course.isFree || userData.isSubscribed || userData.purchasedCourses.includes(course.id);
               return (
                <div key={course.id} onClick={() => handleCourseClick(course)} className="group bg-white rounded-[2.5rem] overflow-hidden border-2 border-orange-50 shadow-xl shadow-orange-100/50 hover:shadow-2xl hover:shadow-orange-200/50 hover:border-orange-300 transition-all duration-500 cursor-pointer flex flex-col h-full hover:-translate-y-3">
                  <div className="relative h-64 overflow-hidden p-4 pb-0">
                    <img src={course.image} alt={course.title} className={`w-full h-full object-cover rounded-[2rem] shadow-sm transition-transform duration-700 group-hover:scale-110 ${!isUnlocked ? 'grayscale opacity-80' : ''}`} />
                    <div className="absolute top-8 left-8"><Badge color="teal" className="shadow-md">{course.category}</Badge></div>
                    {!isUnlocked && (<div className="absolute inset-0 bg-slate-900/30 flex items-center justify-center backdrop-blur-[2px] m-4 rounded-[2rem]"><div className="bg-white/90 p-4 rounded-full shadow-lg"><Lock className="text-slate-700" size={32} /></div></div>)}
                  </div>
                  <div className="p-8 flex-1 flex flex-col">
                    <h3 className="text-2xl font-black text-slate-800 mb-4 leading-snug group-hover:text-orange-500 transition-colors line-clamp-2">{course.title}</h3>
                    <p className="text-slate-600 text-lg mb-8 line-clamp-3 flex-1 leading-relaxed font-medium">{course.description}</p>
                    <div className="mt-auto flex justify-between items-center">
                       <span className="text-sm text-slate-500 font-bold bg-orange-50 px-4 py-2 rounded-full flex items-center gap-2"><CalendarCheck size={16} className="text-orange-400"/> {course.duration}</span>
                       <Button variant={isUnlocked ? 'secondary' : 'primary'} className={`h-12 px-6 text-base ${isUnlocked ? 'border-2 border-green-200 bg-green-50 text-green-700 hover:bg-green-100 hover:border-green-300' : ''}`}>
                         {isUnlocked ? <span className="flex items-center gap-2">Acceder <ArrowRight size={18}/></span> : (price === 0 ? 'GRATIS' : `$${price.toFixed(2)}`)}
                       </Button>
                    </div>
                  </div>
                </div>
               );
            }) : (
              <div className="col-span-full text-center py-20 animate-fade-in-up">
                <p className="text-slate-500 text-xl font-bold">No encontramos cursos que coincidan con tu búsqueda 🔍</p>
                <button onClick={() => setSearchTerm("")} className="mt-4 text-orange-500 font-bold underline hover:text-orange-600">Ver todos los cursos</button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// --- COMPONENTE COURSE DETAIL VIEW ---
const CourseDetailView = ({ selectedCourse, isRich, setView, user, handleLogin, handlePayment, handleLogout, resetDatabase, userData }) => {
  const [activeTab, setActiveTab] = useState(isRich ? 'plan' : 'video');
  const [expandedWeek, setExpandedWeek] = useState(null);

  return (
    <div className="min-h-screen bg-orange-50/50 pb-20 font-sans text-slate-800 animate-fade-in-up">
      <Navbar user={user} userData={userData} setView={setView} handleLogin={handleLogin} handleLogout={handleLogout} resetDatabase={resetDatabase} />
      <div className="relative pt-24 pb-32 px-6 overflow-hidden">
         <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-orange-200 via-orange-50/50 to-teal-50/50 opacity-70"></div>
         <div className="absolute top-20 right-20 w-64 h-64 bg-teal-200/30 rounded-full blur-3xl mix-blend-multiply animate-pulse-soft"></div>
         <div className="absolute bottom-0 left-20 w-80 h-80 bg-pink-200/30 rounded-full blur-3xl mix-blend-multiply animate-pulse-soft" style={{animationDelay: '1s'}}></div>
         
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <button onClick={() => setView('home')} className="group flex items-center text-slate-500 hover:text-orange-500 mb-8 mx-auto transition-all font-bold bg-white/50 px-4 py-2 rounded-full hover:bg-white"><ChevronRight size={20} className="mr-1 rotate-180 group-hover:-translate-x-1 transition-transform" /> Volver al inicio</button>
          <div className="flex flex-wrap gap-3 mb-6 justify-center">
            <Badge color="teal">{selectedCourse.category}</Badge>
            {isRich && <Badge color="peach"><Sparkles size={12} className="mr-1 inline-block"/> CURSO PREMIUM</Badge>}
          </div>
          <h1 className="text-5xl md:text-6xl font-black mb-8 tracking-tight text-slate-900 leading-tight">{selectedCourse.title}</h1>
          <p className="text-slate-600 text-xl max-w-3xl mx-auto leading-relaxed font-medium">
            {selectedCourse.longDescription || selectedCourse.description}
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 -mt-16 relative z-20">
        <div className="bg-white rounded-[3rem] shadow-2xl shadow-orange-100/50 border border-white/50 backdrop-blur-sm overflow-hidden min-h-[600px] p-2">
          <div className="flex flex-wrap justify-center gap-2 p-4 bg-orange-50/50 rounded-[2.5rem] mb-4">
            {isRich ? (
              <>
                {['plan', 'syllabus', 'tools'].map((tab) => (
                  <button key={tab} onClick={() => setActiveTab(tab)} className={`py-3 px-6 rounded-full text-sm font-bold flex gap-2 items-center transition-all duration-300 ${activeTab === tab ? 'bg-white text-orange-500 shadow-md shadow-orange-100 scale-105' : 'text-slate-500 hover:text-slate-700 hover:bg-white/50'}`}>
                    {tab === 'plan' && <CalendarCheck size={18}/>}
                    {tab === 'syllabus' && <BookOpen size={18}/>}
                    {tab === 'tools' && <PenTool size={18}/>}
                    {tab === 'plan' ? 'Plan de Acción' : tab === 'syllabus' ? 'Temario' : 'Herramientas'}
                  </button>
                ))}
              </>
            ) : (
              <button className="py-3 px-8 rounded-full font-bold bg-white text-orange-500 shadow-md">Video Clase</button>
            )}
          </div>

          <div className="p-6 md:p-10 h-full">
            {activeTab === 'plan' && isRich && (
              <div className="space-y-6 max-w-3xl mx-auto animate-fade-in-up">
                {selectedCourse.actionPlan.map((week) => (
                  <div key={week.week} className="group bg-white border-2 border-orange-50 rounded-[2rem] overflow-hidden hover:border-orange-200 hover:shadow-xl hover:shadow-orange-100/50 transition-all duration-300">
                    <div onClick={() => setExpandedWeek(expandedWeek === week.week ? null : week.week)} className="p-6 flex items-center justify-between cursor-pointer">
                      <div className="flex items-center gap-6">
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-2xl shadow-sm transition-all duration-300 ${expandedWeek === week.week ? 'bg-gradient-to-tr from-orange-400 to-pink-500 text-white scale-110 rotate-3' : 'bg-orange-100 text-orange-500 group-hover:bg-orange-200'}`}>{week.week}</div>
                        <div><p className="text-xs text-orange-400 uppercase font-bold tracking-wider mb-1">Semana {week.week}</p><h4 className="font-bold text-slate-800 text-xl">{week.title}</h4></div>
                      </div>
                      <div className={`p-2 rounded-full bg-orange-50 text-orange-400 transition-transform duration-300 ${expandedWeek === week.week ? 'rotate-180 bg-orange-100' : 'group-hover:bg-orange-100'}`}><ChevronDown size={24}/></div>
                    </div>
                    {expandedWeek === week.week && (
                      <div className="px-8 pb-8 pt-2 animate-fade-in-up">
                        <ul className="space-y-4 relative pl-2 before:absolute before:left-0 before:top-2 before:bottom-2 before:w-1 before:bg-orange-100 before:rounded-full">
                          {week.tasks.map((task, i) => (
                            <li key={i} className="flex items-start gap-4 text-slate-600 leading-relaxed font-medium bg-orange-50/50 p-4 rounded-2xl"><div className="bg-white p-1 rounded-full shadow-sm"><CheckCircle size={20} className="text-teal-500 flex-shrink-0" /></div><span>{task}</span></li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'syllabus' && isRich && (
              <div className="space-y-8 max-w-3xl mx-auto animate-fade-in-up">
                {selectedCourse.syllabus.map((mod, i) => (
                  <div key={i} className="group bg-white p-8 rounded-[2.5rem] border-2 border-orange-50 shadow-sm hover:border-orange-200 hover:shadow-xl hover:shadow-orange-100/50 transition-all duration-300">
                    <h3 className="font-bold text-2xl text-slate-800 mb-8 flex items-center gap-4"><span className="bg-teal-100 text-teal-700 w-12 h-12 rounded-2xl flex items-center justify-center text-lg font-black">{i+1}</span>{mod.title}</h3>
                    <div className="space-y-8 pl-6 border-l-4 border-teal-100 ml-6">
                      {mod.content.map((item, j) => (
                        <div key={j} className="relative pl-6 before:absolute before:left-[-0.65rem] before:top-2 before:w-4 before:h-4 before:bg-white before:border-4 before:border-teal-200 before:rounded-full">
                          <h5 className="font-bold text-slate-800 text-xl mb-3">{item.subtitle}</h5>
                          <p className="text-slate-600 leading-relaxed font-medium bg-teal-50/30 p-4 rounded-2xl">{item.text}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'tools' && isRich && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto animate-fade-in-up">
                {selectedCourse.tools.map((tool, i) => (
                  <a key={i} href={tool.link} target="_blank" rel="noopener noreferrer" className="bg-white p-6 rounded-[2.5rem] border-2 border-orange-50 shadow-sm hover:border-orange-300 hover:shadow-2xl hover:shadow-orange-100/50 transition-all duration-300 group flex items-start gap-6 hover:-translate-y-2">
                    <div className="bg-gradient-to-br from-orange-100 to-pink-100 p-5 rounded-2xl group-hover:scale-110 group-hover:rotate-3 transition-all shadow-sm">
                       <PenTool size={32} className="text-orange-500"/>
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800 text-xl flex items-center gap-2 mb-3 group-hover:text-orange-500 transition-colors">{tool.name} <ExternalLink size={16} className="opacity-50 group-hover:opacity-100 transition-opacity text-orange-400"/></h4>
                      <p className="text-slate-600 leading-relaxed font-medium">{tool.desc}</p>
                    </div>
                  </a>
                ))}
              </div>
            )}

            {(!isRich || activeTab === 'video') && (
               <div className="flex flex-col items-center justify-center text-center h-full py-20 animate-fade-in-up">
                  <div className="bg-orange-100 p-10 rounded-full mb-8 shadow-lg shadow-orange-100 animate-pulse-soft"><Video size={80} className="text-orange-400"/></div>
                  <h3 className="font-bold text-3xl text-slate-700 mb-4">Video Introductorio</h3>
                  <p className="text-slate-500 max-w-md text-xl font-medium">Contenido próximamente.</p>
               </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// --- APP PRINCIPAL ---
export default function App() {
  const [view, setView] = useState('home'); 
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentType, setPaymentType] = useState(null); 
  const [notification, setNotification] = useState(null);
  const [isLoadingPayment, setIsLoadingPayment] = useState(false);

  // DATA Y BÚSQUEDA
  const [courses, setCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState(""); 
  const [loadingCourses, setLoadingCourses] = useState(true);
  const [user, setUser] = useState(null); 
  const [userData, setUserData] = useState({ purchasedCourses: [], isSubscribed: false });

  // 1. CARGAR CURSOS
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "courses"));
        setCourses(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (error) {
        console.error("Error courses:", error);
      } finally {
        setLoadingCourses(false);
      }
    };
    fetchCourses();
  }, []);

  // 2. AUTH USUARIO
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const userDocRef = doc(db, "users", currentUser.uid);
        onSnapshot(userDocRef, (docSnap) => {
          if (docSnap.exists()) setUserData(docSnap.data());
          else setDoc(userDocRef, { email: currentUser.email, purchasedCourses: [], isSubscribed: false }, { merge: true });
        });
      } else {
        setUserData({ purchasedCourses: [], isSubscribed: false });
      }
    });
    return () => unsubscribe();
  }, []);

  // ADMIN: RESET TOTAL
  const resetDatabase = async () => {
    if (!confirm("⚠️ ¡PELIGRO! Esto borrará TODOS los cursos actuales y subirá limpios los 15 nuevos. ¿Continuar?")) return;
    try {
      showNotification("Limpiando base de datos...", "warning");
      const querySnapshot = await getDocs(collection(db, "courses"));
      const batchDelete = writeBatch(db);
      querySnapshot.forEach((doc) => batchDelete.delete(doc.ref));
      await batchDelete.commit();

      showNotification("Subiendo 15 cursos nuevos...", "warning");
      const batchUpload = writeBatch(db);
      ALL_COURSES.forEach((courseData) => {
        const newDocRef = doc(collection(db, "courses")); 
        batchUpload.set(newDocRef, courseData);
      });
      await batchUpload.commit();
      
      showNotification("¡Base de datos REINICIADA correctamente! Recargando...", "success");
      setTimeout(() => window.location.reload(), 2000);
    } catch (e) {
      console.error(e);
      showNotification("Error en el proceso.", "error");
    }
  };

  const handleLogin = async () => {
    try { await signInWithPopup(auth, googleProvider); showNotification("¡Bienvenido!", "success"); } 
    catch (error) { showNotification("Error login", "error"); }
  };

  const handleLogout = async () => { await signOut(auth); setView('home'); };

  const showNotification = (msg, type = 'success') => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 4000);
  };

  const handleCourseClick = (course) => {
    const isUnlocked = course.isFree || userData.isSubscribed || userData.purchasedCourses.includes(course.id);
    if (isUnlocked) {
      setSelectedCourse(course);
      setView('course-detail');
      window.scrollTo(0, 0);
    } else {
      if (!user) { showNotification("Inicia sesión primero", "error"); handleLogin(); return; }
      setSelectedCourse(course);
      setPaymentType('single');
      setShowPaymentModal(true);
    }
  };

  const handlePayment = async (type) => {
    setIsLoadingPayment(true);
    setTimeout(async () => {
      const userRef = doc(db, "users", user.uid);
      if (confirm("Simulando pago...")) {
        if (type === 'subscription') await updateDoc(userRef, { isSubscribed: true });
        else await updateDoc(userRef, { purchasedCourses: arrayUnion(selectedCourse.id) });
        showNotification("¡Pago Exitoso!", "success");
        setShowPaymentModal(false);
      }
      setIsLoadingPayment(false);
    }, 2000);
  };

  // --- RENDER PRINCIPAL ---
  return (
    <div className="font-sans text-slate-800 bg-orange-50/30 min-h-screen selection:bg-orange-200 selection:text-orange-800">
      {notification && <div className={`fixed top-8 left-1/2 transform -translate-x-1/2 z-[100] px-8 py-4 rounded-full shadow-2xl flex items-center gap-4 animate-fade-in-up ${notification.type === 'error' ? 'bg-red-50 text-red-600 border-2 border-red-100' : 'bg-teal-50 text-teal-700 border-2 border-teal-100'} text-base font-bold backdrop-blur-md`}><CheckCircle size={24} /> {notification.msg}</div>}
      
      {view === 'home' && (
        <HomeView 
          courses={courses} 
          loadingCourses={loadingCourses} 
          userData={userData} 
          user={user}
          handleCourseClick={handleCourseClick}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          setView={setView}
          handleLogin={handleLogin}
          handleLogout={handleLogout}
          resetDatabase={resetDatabase}
        />
      )}
      
      {view === 'course-detail' && (
        <CourseDetailView 
          selectedCourse={selectedCourse}
          isRich={selectedCourse?.isRichContent}
          setView={setView}
          user={user}
          handleLogin={handleLogin}
          handlePayment={handlePayment}
          handleLogout={handleLogout}
          resetDatabase={resetDatabase}
          userData={userData}
        />
      )}

      {/* MODAL DE PAGO REUTILIZABLE */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-fade-in-up">
          <div className="bg-white rounded-[3rem] shadow-2xl max-w-md w-full p-10 text-center relative overflow-hidden border-4 border-orange-100">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-orange-400 to-pink-500"></div>
            <h3 className="text-3xl font-black mb-4 text-slate-800 leading-tight">Desbloquea tu Potencial</h3>
            <p className="text-slate-600 mb-8 font-medium">Acceso vitalicio a este curso.</p>
            <div className="bg-orange-50 p-6 rounded-3xl mb-8 border border-orange-100">
              <p className="text-sm text-orange-600 font-bold uppercase tracking-wider mb-2">Inversión Única</p>
              <p className="text-5xl font-black text-slate-800">$2.00</p>
            </div>
            <Button onClick={() => handlePayment(paymentType)} variant="primary" className="w-full h-16 text-xl shadow-xl shadow-orange-500/20">
              {isLoadingPayment ? <Loader className="animate-spin"/> : "Confirmar y Empezar"}
            </Button>
            <button onClick={() => setShowPaymentModal(false)} className="w-full mt-6 text-sm font-bold text-slate-400 hover:text-slate-600 transition-colors uppercase tracking-wider">Cancelar</button>
          </div>
        </div>
      )}
    </div>
  );
}