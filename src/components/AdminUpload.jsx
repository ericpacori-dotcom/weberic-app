// src/components/AdminUpload.jsx
import React, { useState } from 'react';
import { db } from '../firebase';
import { collection, getDocs, writeBatch, doc } from 'firebase/firestore';
import { ALL_COURSES } from '../content/courses_data'; // Asegúrate de haber actualizado este archivo primero

export default function AdminUpload() {
  const [status, setStatus] = useState('idle'); // idle, loading, success, error

  const handleUpload = async () => {
    const confirm = window.confirm(
      "⚠️ ¿ESTÁS SEGURO?\n\nEsto BORRARÁ permanentemente todos los cursos que existen ahora en tu Firebase y subirá los 20 nuevos del archivo local.\n\nEsta acción no se puede deshacer."
    );
    
    if (!confirm) return;
    
    setStatus('loading');
    try {
      const batch = writeBatch(db);
      const coursesRef = collection(db, "courses");

      // 1. Obtener todos los cursos actuales de Firebase
      console.log("Obteniendo cursos antiguos...");
      const snapshot = await getDocs(coursesRef);
      
      // 2. Preparar el borrado (Delete)
      snapshot.docs.forEach((docSnapshot) => {
        batch.delete(docSnapshot.ref);
      });
      console.log(`Se marcaron ${snapshot.size} cursos antiguos para borrar.`);

      // 3. Preparar la subida de los nuevos (Set)
      ALL_COURSES.forEach((course) => {
        // Usamos el ID numérico convertido a string como ID del documento
        // Esto mantiene el orden (1, 2, 3...)
        const newDocRef = doc(coursesRef, course.id.toString());
        batch.set(newDocRef, course);
      });
      console.log(`Se prepararon ${ALL_COURSES.length} cursos nuevos para subir.`);

      // 4. Ejecutar todo junto (Commit)
      await batch.commit();
      
      setStatus('success');
      alert(`¡ÉXITO TOTAL!\n\n- Se eliminaron los cursos viejos.\n- Se subieron los ${ALL_COURSES.length} cursos nuevos.\n\nYa puedes borrar este botón.`);
      
    } catch (error) {
      console.error("Error en la migración:", error);
      setStatus('error');
      alert("Hubo un error. Revisa la consola del navegador (F12) para ver los detalles.");
    }
  };

  if (status === 'success') return null; // Se oculta solo al terminar

  return (
    <div className="fixed bottom-4 left-4 z-[9999] p-4 bg-slate-900 rounded-xl border-2 border-red-500 shadow-2xl max-w-xs animate-bounce-in">
      <h3 className="text-white font-bold mb-2 text-sm text-center">⚙️ MODO ADMINISTRADOR</h3>
      <p className="text-gray-400 text-xs mb-3 text-center">
        Úsalo una sola vez para actualizar la base de datos.
      </p>
      <button 
        onClick={handleUpload}
        disabled={status === 'loading'}
        className={`w-full py-3 px-4 rounded-lg font-bold text-white text-xs transition-all ${
          status === 'loading' 
            ? 'bg-gray-600 cursor-not-allowed' 
            : 'bg-red-600 hover:bg-red-700 shadow-[0_0_15px_rgba(220,38,38,0.5)]'
        }`}
      >
        {status === 'loading' ? '🔄 PROCESANDO...' : '🚀 ACTUALIZAR DB AHORA'}
      </button>
    </div>
  );
}