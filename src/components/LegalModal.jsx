// src/components/LegalModal.jsx
import React from 'react';
import { X } from 'lucide-react';
import { COLORS } from '../utils/constants';

export default function LegalModal({ type, onClose }) {
  if (!type) return null;

  // CONSTANTES UNIFICADAS
  const COMPANY_NAME = "Haeric Academy";
  const SUPPORT_EMAIL = "haeric.com@gmail.com";

  const content = {
    terms: {
      title: "Términos y Condiciones",
      body: (
        <>
          <p className="mb-4">Bienvenido a {COMPANY_NAME}. Al utilizar nuestra plataforma, aceptas los siguientes términos:</p>
          <ul className="list-disc pl-5 space-y-2 text-[#BCCCDC]">
            <li><b>Uso del Servicio:</b> Nuestros cursos y herramientas son productos digitales. El acceso es personal e intransferible.</li>
            <li><b>Propiedad Intelectual:</b> Todo el contenido es propiedad de {COMPANY_NAME}. Queda prohibida su redistribución.</li>
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
            <li><b>Contacto:</b> Para ejercer tus derechos ARCO, contáctanos en <span className="text-white font-bold">{SUPPORT_EMAIL}</span>.</li>
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
            <li><b>Proceso:</b> Para solicitarlo, envía un correo a <span className="text-white font-bold">{SUPPORT_EMAIL}</span> con tu comprobante de pago.</li>
            <li><b>Suscripciones:</b> Puedes cancelar tu suscripción recurrente en cualquier momento.</li>
          </ul>
        </>
      )
    },
    about: {
      title: "Sobre Nosotros",
      body: (
        <>
          <p className="mb-4"><b>{COMPANY_NAME}</b> es una plataforma educativa enfocada en democratizar el uso de la Inteligencia Artificial.</p>
          <p className="text-[#BCCCDC]">Nuestra misión es ayudar a emprendedores a crear activos digitales escalables, eliminando las barreras técnicas tradicionales.</p>
        </>
      )
    },
    help: {
      title: "Centro de Ayuda",
      body: (
        <>
          <p className="mb-4">¿Necesitas asistencia con tu cuenta o pagos?</p>
          <div className="bg-[#102A43] p-4 rounded-lg border border-[#334E68] text-center my-4">
             <p className="text-sm text-[#BCCCDC]">Escríbenos a:</p>
             <a href={`mailto:${SUPPORT_EMAIL}`} className="text-xl font-bold text-white hover:text-[#F9703E]">{SUPPORT_EMAIL}</a>
          </div>
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

        {/* Body */}
        <div className="p-8 overflow-y-auto custom-scrollbar text-sm leading-relaxed text-[#9FB3C8]">
          {selectedContent.body}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#334E68] bg-[#102A43] rounded-b-2xl flex justify-end">
          <button onClick={onClose} className="px-6 py-2 bg-[#334E68] hover:bg-[#486581] text-white font-bold rounded-lg transition-colors">
            Cerrar
          </button>
        </div>

      </div>
    </div>
  );
}