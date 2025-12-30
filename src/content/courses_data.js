// src/content/courses_data.js

export const ALL_COURSES = [
  // --- 🎨 DISEÑO, 3D Y CONTENIDO VISUAL ---
  {
    id: 1,
    title: "Creación de objetos 3D con IA",
    desc: "Aprende a crear modelos 3D usando IA sin ser experto. Enfocado en miniaturas, impresión 3D y assets para videojuegos.",
    category: "Diseño 3D",
    level: "Intermedio",
    price: 49.90,
    image: "https://images.unsplash.com/photo-1617791160505-6f00504e3519?w=800&auto=format&fit=crop&q=60",
    tools: [
      { name: "Meshy", url: "https://www.meshy.ai" },
      { name: "Kaedim", url: "https://www.kaedim3d.com" },
      { name: "Blender", url: "https://www.blender.org" }
    ],
    platforms: ["Cults3D", "CGTrader", "Sketchfab Store"],
    monetization: ["Venta por modelo", "Packs de assets", "Licencias comerciales"]
  },
  {
    id: 2,
    title: "Mockups realistas con IA",
    desc: "Crea mockups hiperrealistas de productos físicos sin cámara. Ideal para tiendas de Etsy y Amazon.",
    category: "Diseño Visual",
    level: "Principiante",
    price: 39.90,
    image: "https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?w=800&auto=format&fit=crop&q=60",
    tools: [
      { name: "Midjourney", url: "https://www.midjourney.com" },
      { name: "Canva Mockups", url: "https://www.canva.com" },
      { name: "Photoshop", url: "https://www.adobe.com/products/photoshop.html" }
    ],
    platforms: ["Fiverr", "Upwork", "Trato directo Etsy/Amazon"],
    monetization: ["Precio por mockup", "Paquetes mensuales"]
  },
  {
    id: 3,
    title: "Ilustraciones para libros infantiles",
    desc: "Creación de ilustraciones consistentes para cuentos infantiles usando IA y maquetación profesional.",
    category: "Diseño Visual",
    level: "Principiante",
    price: 45.00,
    image: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800&auto=format&fit=crop&q=60",
    tools: [
      { name: "Midjourney", url: "https://www.midjourney.com" },
      { name: "Canva", url: "https://www.canva.com" },
      { name: "ChatGPT", url: "https://chat.openai.com" }
    ],
    platforms: ["Amazon KDP", "Fiverr", "Upwork"],
    monetization: ["Proyecto completo", "Ilustración por página"]
  },
  {
    id: 4,
    title: "Diseño de personajes (Game Assets)",
    desc: "Creación de personajes 2D/3D reutilizables para videojuegos y proyectos creativos (sin cripto).",
    category: "Diseño 3D",
    level: "Avanzado",
    price: 59.90,
    image: "https://images.unsplash.com/photo-1635322966219-b75ed3a901d0?w=800&auto=format&fit=crop&q=60",
    tools: [
      { name: "Leonardo AI", url: "https://leonardo.ai" },
      { name: "Midjourney", url: "https://www.midjourney.com" },
      { name: "Blender", url: "https://www.blender.org" }
    ],
    platforms: ["itch.io", "CGTrader", "Gumroad"],
    monetization: ["Packs de personajes", "Licencias comerciales"]
  },
  {
    id: 5,
    title: "Stickers y emojis con IA",
    desc: "Crea packs de stickers y emojis expresivos listos para usar en WhatsApp y Telegram.",
    category: "Diseño Visual",
    level: "Principiante",
    price: 29.90,
    image: "https://images.unsplash.com/photo-1586810165616-94c631fc2f79?w=800&auto=format&fit=crop&q=60",
    tools: [
      { name: "Leonardo AI", url: "https://leonardo.ai" },
      { name: "Canva", url: "https://www.canva.com" },
      { name: "Sticker.ly", url: "https://www.sticker.ly" }
    ],
    platforms: ["Gumroad", "Etsy"],
    monetization: ["Venta por pack", "Servicio marca blanca"]
  },

  // --- 🎥 VIDEO, REELS Y CONTENIDO CORTO ---
  {
    id: 6,
    title: "Videos Faceless (Sin rostro)",
    desc: "Automatización de videos para TikTok y Shorts sin mostrar tu cara. Monetización y servicios.",
    category: "Video y Reels",
    level: "Intermedio",
    price: 49.90,
    image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&auto=format&fit=crop&q=60",
    tools: [
      { name: "Pictory", url: "https://pictory.ai" },
      { name: "Runway", url: "https://runwayml.com" },
      { name: "CapCut AI", url: "https://www.capcut.com" }
    ],
    platforms: ["TikTok Creator Program", "YouTube Shorts", "Venta B2B"],
    monetization: ["Publicidad", "Venta de servicios"]
  },
  {
    id: 7,
    title: "Anuncios en video para Negocios",
    desc: "Creación rápida de spots publicitarios para pymes, restaurantes y locales sin grabaciones.",
    category: "Video y Reels",
    level: "Intermedio",
    price: 55.00,
    image: "https://images.unsplash.com/photo-1536240478700-b869070f9279?w=800&auto=format&fit=crop&q=60",
    tools: [
      { name: "InVideo AI", url: "https://invideo.io" },
      { name: "Runway", url: "https://runwayml.com" },
      { name: "Canva Video", url: "https://www.canva.com" }
    ],
    platforms: ["Venta directa", "Fiverr", "Upwork"],
    monetization: ["Por anuncio", "Paquetes mensuales"]
  },
  {
    id: 8,
    title: "Edición Viral de Podcasts",
    desc: "Transforma podcasts largos en clips cortos verticales optimizados para retención.",
    category: "Video y Reels",
    level: "Principiante",
    price: 39.90,
    image: "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=800&auto=format&fit=crop&q=60",
    tools: [
      { name: "Opus Clip", url: "https://www.opus.pro" },
      { name: "Descript", url: "https://www.descript.com" }
    ],
    platforms: ["Podcasters", "Coaches", "Agencias"],
    monetization: ["Suscripción mensual por edición"]
  },

  // --- ✍️ TEXTO, COPYWRITING Y CONTENIDO ---
  {
    id: 9,
    title: "Ebooks Ultra-Nicho con IA",
    desc: "Creación rápida de ebooks enfocados en problemas específicos para vender en Amazon.",
    category: "Copywriting",
    level: "Principiante",
    price: 35.00,
    image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=800&auto=format&fit=crop&q=60",
    tools: [
      { name: "ChatGPT", url: "https://chat.openai.com" },
      { name: "Canva", url: "https://www.canva.com" },
      { name: "Grammarly", url: "https://www.grammarly.com" }
    ],
    platforms: ["Amazon KDP", "Gumroad"],
    monetization: ["Regalías por venta"]
  },
  {
    id: 10,
    title: "Descripciones SEO E-commerce",
    desc: "Redacción masiva enfocada en conversión y SEO para productos de Etsy y Amazon.",
    category: "Copywriting",
    level: "Intermedio",
    price: 45.00,
    image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&auto=format&fit=crop&q=60",
    tools: [
      { name: "ChatGPT", url: "https://chat.openai.com" },
      { name: "Ubersuggest", url: "https://neilpatel.com/ubersuggest" }
    ],
    platforms: ["Fiverr", "Upwork"],
    monetization: ["Por paquete de productos"]
  },
  {
    id: 11,
    title: "Newsletters Automatizadas",
    desc: "Diseña un sistema completo de boletines por correo para pymes y marcas personales.",
    category: "Copywriting",
    level: "Avanzado",
    price: 59.90,
    image: "https://images.unsplash.com/photo-1586339949916-3e9457bef6d3?w=800&auto=format&fit=crop&q=60",
    tools: [
      { name: "ChatGPT", url: "https://chat.openai.com" },
      { name: "MailerLite", url: "https://www.mailerlite.com" },
      { name: "Zapier", url: "https://zapier.com" }
    ],
    platforms: ["Negocios Locales", "Influencers"],
    monetization: ["Pago mensual recurrente"]
  },
  {
    id: 12,
    title: "Guiones de Ventas y WhatsApp",
    desc: "Genera scripts de venta persuasivos y secuencias de mensajes listos para cerrar tratos.",
    category: "Copywriting",
    level: "Intermedio",
    price: 39.90,
    image: "https://images.unsplash.com/photo-1556742049-0cfed4f7a07d?w=800&auto=format&fit=crop&q=60",
    tools: [
      { name: "ChatGPT", url: "https://chat.openai.com" },
      { name: "ManyChat", url: "https://manychat.com" }
    ],
    platforms: ["Agencias de Marketing", "Negocios Locales"],
    monetization: ["Por proyecto de guion"]
  },

  // --- 🧠 AUTOMATIZACIÓN Y SERVICIOS IA ---
  {
    id: 13,
    title: "Chatbots IA para Ventas",
    desc: "Implementa asistentes virtuales inteligentes en WhatsApp y Web para atención al cliente.",
    category: "Automatización",
    level: "Avanzado",
    price: 69.90,
    image: "https://images.unsplash.com/photo-1531746790731-6c087fecd65a?w=800&auto=format&fit=crop&q=60",
    tools: [
      { name: "ManyChat", url: "https://manychat.com" },
      { name: "ChatGPT API", url: "https://openai.com/blog/openai-api" },
      { name: "Tidio", url: "https://www.tidio.com" }
    ],
    platforms: ["PyMEs", "E-commerce"],
    monetization: ["Setup inicial + Mensualidad"]
  },
  {
    id: 14,
    title: "Automatización Instagram DM",
    desc: "Configura respuestas automáticas inteligentes 24/7 para influencers y tiendas.",
    category: "Automatización",
    level: "Intermedio",
    price: 49.90,
    image: "https://images.unsplash.com/photo-1611262588024-d12430b98920?w=800&auto=format&fit=crop&q=60",
    tools: [
      { name: "ManyChat", url: "https://manychat.com" },
      { name: "Zapier", url: "https://zapier.com" }
    ],
    platforms: ["Emprendedores", "Marcas de ropa"],
    monetization: ["Servicio de configuración"]
  },
  {
    id: 15,
    title: "Optimización CV y LinkedIn",
    desc: "Reescribe perfiles y CVs para pasar filtros ATS y destacar profesionalmente.",
    category: "Automatización",
    level: "Principiante",
    price: 29.90,
    image: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=800&auto=format&fit=crop&q=60",
    tools: [
      { name: "ChatGPT", url: "https://chat.openai.com" },
      { name: "Resume.io", url: "https://resume.io" }
    ],
    platforms: ["Venta directa", "Fiverr"],
    monetization: ["Por CV optimizado"]
  },
  {
    id: 16,
    title: "Análisis de Datos con IA",
    desc: "Ofrece análisis de Excel y métricas de negocio usando Code Interpreter sin programar.",
    category: "Automatización",
    level: "Avanzado",
    price: 55.00,
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=60",
    tools: [
      { name: "ChatGPT Plus", url: "https://chat.openai.com" },
      { name: "Google Sheets", url: "https://sheets.google.com" },
      { name: "Excel", url: "https://www.microsoft.com/excel" }
    ],
    platforms: ["Pymes", "Freelance"],
    monetization: ["Consultoría por hora/proyecto"]
  },

  // --- 📦 PRODUCTOS DIGITALES RÁPIDOS ---
  {
    id: 17,
    title: "Planners y Trackers Digitales",
    desc: "Diseña agendas y organizadores para iPad/Tablets. Nicho salud y productividad.",
    category: "Productos Digitales",
    level: "Principiante",
    price: 25.00,
    image: "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=800&auto=format&fit=crop&q=60",
    tools: [
      { name: "Canva", url: "https://www.canva.com" },
      { name: "ChatGPT", url: "https://chat.openai.com" }
    ],
    platforms: ["Etsy", "Gumroad"],
    monetization: ["Venta de archivo digital"]
  },
  {
    id: 18,
    title: "Plantillas Notion Pro",
    desc: "Crea sistemas operativos completos en Notion para nichos específicos.",
    category: "Productos Digitales",
    level: "Intermedio",
    price: 35.00,
    image: "https://images.unsplash.com/photo-1517842645767-c639042777db?w=800&auto=format&fit=crop&q=60",
    tools: [
      { name: "Notion", url: "https://www.notion.so" },
      { name: "Notion AI", url: "https://www.notion.so/product/ai" }
    ],
    platforms: ["Etsy", "Gumroad"],
    monetization: ["Venta pasiva"]
  },
  {
    id: 19,
    title: "Ingeniería de Prompts",
    desc: "Crea y vende prompts profesionales para Midjourney y GPT.",
    category: "Productos Digitales",
    level: "Avanzado",
    price: 39.90,
    image: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&auto=format&fit=crop&q=60",
    tools: [
      { name: "ChatGPT", url: "https://chat.openai.com" }
    ],
    platforms: ["PromptBase", "Gumroad"],
    monetization: ["Venta por prompt"]
  },
  {
    id: 20,
    title: "Bancos de Imágenes Nicho",
    desc: "Genera stock photos ultra-específicas para vender a diseñadores y agencias.",
    category: "Productos Digitales",
    level: "Intermedio",
    price: 29.90,
    image: "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=800&auto=format&fit=crop&q=60",
    tools: [
      { name: "Midjourney", url: "https://www.midjourney.com" },
      { name: "Leonardo AI", url: "https://leonardo.ai" }
    ],
    platforms: ["Shutterstock", "Adobe Stock"],
    monetization: ["Regalías por descarga"]
  }
];