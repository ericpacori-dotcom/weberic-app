// src/content/legal_data.js
export const LEGAL_DATA = {
  terms: {
    title: "Términos y Condiciones",
    content: `
      <h3 class="text-xl font-bold text-[#F9703E] mb-2">1. Introducción</h3>
      <p class="mb-4">Bienvenido a <strong>Haeric Academy</strong>. Al acceder a nuestra plataforma y comprar nuestros cursos, aceptas cumplir estos términos. Somos una plataforma educativa enfocada en Inteligencia Artificial y Emprendimiento.</p>
      
      <h3 class="text-xl font-bold text-[#F9703E] mb-2">2. Propiedad Intelectual</h3>
      <p class="mb-4">Todo el contenido (videos, textos, código, prompts) es propiedad exclusiva de Haeric Academy. La compra de un curso te otorga una licencia personal, intransferible y no exclusiva para ver el contenido. Está estrictamente prohibido revender, distribuir o compartir tu cuenta.</p>
      
      <h3 class="text-xl font-bold text-[#F9703E] mb-2">3. Pagos y Reembolsos</h3>
      <p class="mb-4">Los precios están expresados en dólares estadounidenses (USD). Ofrecemos una garantía de satisfacción. Si el contenido no cumple tus expectativas, puedes solicitar un reembolso a través de nuestro soporte dentro de los primeros 7 días de compra.</p>
      
      <h3 class="text-xl font-bold text-[#F9703E] mb-2">4. Responsabilidad</h3>
      <p class="mb-4">Nuestros cursos son educativos. El uso de las herramientas de IA enseñadas es responsabilidad del usuario.</p>
    `
  },
  privacy: {
    title: "Política de Privacidad",
    content: `
      <h3 class="text-xl font-bold text-[#F9703E] mb-2">1. Qué información recolectamos</h3>
      <p class="mb-4">Recopilamos tu nombre, correo electrónico y foto de perfil a través de la autenticación de Google (Firebase Auth). No almacenamos datos de tarjetas de crédito directamente.</p>
      
      <h3 class="text-xl font-bold text-[#F9703E] mb-2">2. Uso de la información</h3>
      <p class="mb-4">Usamos tus datos para darte acceso a los cursos y mejorar tu experiencia. No vendemos tu información.</p>
      
      <h3 class="text-xl font-bold text-[#F9703E] mb-2">3. Contacto</h3>
      <p class="mb-4">Para ejercer tus derechos sobre tus datos, contáctanos en <strong>haeric.com@gmail.com</strong>.</p>
    `
  },
  // Agregamos data para About y Help para que no falle si decidimos usarlo
  about: {
    title: "Sobre Nosotros",
    content: `
      <h3 class="text-xl font-bold text-[#F9703E] mb-2">Nuestra Misión</h3>
      <p class="mb-4"><strong>Haeric Academy</strong> nace con un propósito claro: democratizar el acceso a la creación de riqueza digital con IA.</p>
    `
  },
  help: {
    title: "Centro de Ayuda",
    content: `
      <h3 class="text-xl font-bold text-[#F9703E] mb-2">¿Necesitas asistencia?</h3>
      <p class="mb-4">Estamos aquí para ayudarte. Si tienes problemas con tu cuenta, contáctanos:</p>
      <p class="text-lg font-bold text-white">haeric.com@gmail.com</p>
    `
  }
};