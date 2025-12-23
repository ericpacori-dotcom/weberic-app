// src/components/LegalModal.jsx
import React from 'react';
import { X } from 'lucide-react';
import { COLORS } from '../utils/constants';

export default function LegalModal({ type, onClose }) {
  if (!type) return null;

  const content = {
    terms: {
      title: "Términos y Condiciones",
      body: (
        <>
          <p className="mb-4">Bienvenido a Haeric Academy. Al utilizar nuestra plataforma, aceptas los siguientes términos:</p>
          <ul className="list-disc pl-5 space-y-2 text-[#BCCCDC]">
            <li><b>Uso del Servicio:</b> Nuestros cursos y herramientas son productos digitales. El acceso es personal e intransferible.</li>
            <li><b>Propiedad Intelectual:</b> Todo el contenido es propiedad de Haeric Academy. Queda prohibida su redistribución.</li>
            <li><b>Disponibilidad:</b> Nos esforzamos por mantener el servicio 99.9% activo, pero nos reservamos el derecho a mantenimiento.</li>
            <li><b>Pagos:</b> Los cobros son procesados de forma segura por Mercado Pago y PayPal.</li>
          </ul>
        </>
      )
    },
    privacy: {
      title: "Política de Privacidad",
      body: (
        <>
          <p className="mb-4">Tu privacidad es fundamental. Así es como manejamos tus datos:</p>
          <ul className="list-disc pl-5 space-y-2 text-[#BCCCDC]">
            <li><b>Datos Recopilados:</b> Solo almacenamos tu email para el inicio de sesión y tu estado de suscripción.</li>
            <li><b>No compartimos datos:</b> Tu información nunca será vendida a terceros.</li>
            <li><b>Cookies:</b> Utilizamos cookies esenciales para mantener tu sesión activa y segura.</li>
            <li><b>Contacto:</b> Para ejercer tus derechos ARCO, contáctanos en <span className="text-white font-bold">haeric.com@gmail.com</span>.</li>
          </ul>
        </>
      )
    },
    refunds: {
      title: "Política de Reembolsos",
      body: (
        <>
          <p className="mb-4">Queremos que estés 100% satisfecho. Esta es nuestra garantía:</p>
          <ul className="list-disc pl-5 space-y-2 text-[#BCCCDC]">
            <li><b>Plazo de Garantía:</b> Tienes <b className="text-white">7 días naturales</b> desde la fecha de compra para solicitar un reembolso completo si el contenido no cumple tus expectativas.</li>
            <li><b>Proceso:</b> Para solicitarlo, envía un correo a <span className="text-white font-bold">haeric.com@gmail.com</span> con tu comprobante de pago.</li>
            <li><b>Suscripciones:</b> Puedes cancelar tu suscripción recurrente en cualquier momento. El acceso se mantendrá hasta el final del ciclo facturado.</li>
            <li><b>Excepciones:</b> No se aplican reembolsos si se detecta un uso abusivo o descargas masivas del contenido.</li>
          </ul>
        </>
      )
    }
  };

  const selectedContent = content[type] || content.terms;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#102A43]/90 backdrop-blur-md animate-fade-in">
      <div className={`${COLORS.bgCard} w-full max-w-2xl rounded-2xl shadow-2xl border border-[#486581] flex flex-col max-h-[80vh]`}>
        
        {/* Header */}
        <div className="p-6 border-b border-[#334E68] flex justify-between items-center bg-[#102A43] rounded-t-2xl">
          <h2 className="text-2xl font-bold text-white">{selectedContent.title}</h2>
          <button onClick={onClose} className="p-2 hover:bg-[#334E68] rounded-full transition-colors text-[#BCCCDC] hover:text-white">
            <X size={24} />
          </button>
        </div>

        {/* Body (Scrollable) */}
        <div className="p-8 overflow-y-auto custom-scrollbar text-sm leading-relaxed text-[#9FB3C8]">
          {selectedContent.body}
          
          <div className="mt-8 p-4 bg-[#102A43] rounded-lg border border-[#334E68]">
            <p className="text-center font-bold text-[#F0F4F8]">
              ¿Dudas? Contáctanos: <a href="mailto:haeric.com@gmail.com" className="text-[#F9703E] hover:underline">haeric.com@gmail.com</a>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#334E68] bg-[#102A43] rounded-b-2xl flex justify-end">
          <button onClick={onClose} className="px-6 py-2 bg-[#334E68] hover:bg-[#486581] text-white font-bold rounded-lg transition-colors">
            Entendido
          </button>
        </div>

      </div>
    </div>
  );
}