// src/content/courses_data.js

// --- CURSO 1 ---
export const COURSE_1 = {
  id: "crear-vender-ebooks", // NUEVO ID
  title: "Crear y Vender Ebooks con IA",
  category: "E-Publishing",
  image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=1000&auto=format&fit=crop",
  description: "Genera ingresos pasivos publicando libros escritos y diseñados con Inteligencia Artificial.",
  isRichContent: true,
  price: 2.00,
  duration: "3 Semanas",
  syllabus: [
    { title: "Fundamentos", content: [{ subtitle: "Nichos Rentables", text: "Cómo encontrar temas que la gente ya está buscando en Amazon." }] },
    { title: "Creación", content: [{ subtitle: "Redacción con IA", text: "Uso de ChatGPT para generar estructuras y capítulos completos." }] },
    { title: "Publicación", content: [{ subtitle: "KDP y Gumroad", text: "Subir tu archivo, configurar precio y portada." }] }
  ],
  tools: [
    { name: "ChatGPT", desc: "Generación de texto", link: "https://chat.openai.com", icon: "pen" },
    { name: "Notion AI", desc: "Organización y escritura", link: "https://www.notion.so/product/ai", icon: "pen" },
    { name: "Canva AI", desc: "Diseño de portadas", link: "https://www.canva.com", icon: "design" },
    { name: "Atticus", desc: "Formateo profesional", link: "https://www.atticus.io", icon: "settings" }
  ],
  actionPlan: [
    { week: 1, title: "Investigación y Estructura", tasks: ["Elegir nicho en Amazon.", "Crear índice con ChatGPT."] },
    { week: 2, title: "Escritura y Diseño", tasks: ["Generar contenido por capítulos.", "Diseñar portada en Canva."] },
    { week: 3, title: "Lanzamiento", tasks: ["Formatear en PDF/Epub.", "Publicar en Amazon KDP."] },
    { week: 4, title: "Monetización", tasks: ["Venta en Amazon KDP, Etsy y Gumroad."] }
  ]
};

// --- CURSO 2 ---
export const COURSE_2 = {
  id: "packs-graficos-etsy", // NUEVO ID
  title: "Diseño de Packs Gráficos para Etsy",
  category: "Diseño",
  image: "https://images.unsplash.com/photo-1626785774583-b61d28303695?q=80&w=1000&auto=format&fit=crop",
  description: "Crea activos digitales (stickers, planners, arte) con IA y véndelos en automático.",
  isRichContent: true,
  price: 2.00,
  duration: "2 Semanas",
  syllabus: [
    { title: "Creación", content: [{ subtitle: "Prompts de Diseño", text: "Cómo pedirle a Midjourney estilos consistentes." }] },
    { title: "Empaquetado", content: [{ subtitle: "Upscaling", text: "Mejorar la calidad de imagen para impresión." }] }
  ],
  tools: [
    { name: "Midjourney", desc: "Generación de imágenes", link: "https://www.midjourney.com", icon: "image" },
    { name: "DALL·E", desc: "Imágenes OpenAI", link: "https://openai.com/dall-e", icon: "image" },
    { name: "Canva", desc: "Maquetación", link: "https://www.canva.com", icon: "design" },
    { name: "Fotor AI", desc: "Edición rápida", link: "https://www.fotor.com", icon: "design" }
  ],
  actionPlan: [
    { week: 1, title: "Generación de Arte", tasks: ["Crear 50 stickers/imágenes.", "Eliminar fondos y vectorizar."] },
    { week: 2, title: "Tienda Etsy", tasks: ["Crear mockups atractivos.", "Subir packs a Etsy/Creative Market."] },
    { week: 3, title: "Optimización", tasks: ["SEO para Etsy (Títulos y Tags)."] },
    { week: 4, title: "Monetización", tasks: ["Venta recurrente de descargas digitales."] }
  ]
};

// --- CURSO 3 ---
export const COURSE_3 = {
  id: "youtube-automation", // NUEVO ID
  title: "YouTube Automation (Faceless)",
  category: "Video",
  image: "https://images.unsplash.com/photo-1611162616475-46b635cb6868?q=80&w=1000&auto=format&fit=crop",
  description: "Crea canales de YouTube sin mostrar tu cara usando guiones y voces sintéticas.",
  isRichContent: true,
  price: 2.00,
  duration: "4 Semanas",
  syllabus: [
    { title: "Estrategia", content: [{ subtitle: "Nichos CPM Alto", text: "Finanzas, tecnología, curiosidades." }] },
    { title: "Producción", content: [{ subtitle: "Workflow IA", text: "De guion a video terminado en 1 hora." }] }
  ],
  tools: [
    { name: "ElevenLabs", desc: "Voces ultra realistas", link: "https://elevenlabs.io", icon: "audio" },
    { name: "Pika Labs", desc: "Generación de video", link: "https://pika.art", icon: "video" },
    { name: "CapCut", desc: "Edición ágil", link: "https://www.capcut.com", icon: "video" }
  ],
  actionPlan: [
    { week: 1, title: "Canal y Nicho", tasks: ["Definir identidad visual.", "Investigar competencia."] },
    { week: 2, title: "Producción en Masa", tasks: ["Generar 4 guiones.", "Editar con stock clips."] },
    { week: 3, title: "SEO YouTube", tasks: ["Thumbnails clickbait.", "Títulos optimizados."] },
    { week: 4, title: "Monetización", tasks: ["Adsense, afiliados y patrocinios."] }
  ]
};

// --- CURSO 4 ---
export const COURSE_4 = {
  id: "reels-tiktok-b2b", // NUEVO ID
  title: "Reels y TikToks Automáticos B2B",
  category: "Marketing",
  image: "https://images.unsplash.com/photo-1611162618071-b39a2ec055fb?q=80&w=1000&auto=format&fit=crop",
  description: "Ofrece servicios de contenido masivo a empresas. Crea 30 videos en 1 hora.",
  isRichContent: true,
  price: 2.00,
  duration: "2 Semanas",
  syllabus: [
    { title: "Flujo de Trabajo", content: [{ subtitle: "Batch Creation", text: "Crear contenido para todo el mes en una tarde." }] },
    { title: "Venta", content: [{ subtitle: "Propuesta", text: "Cómo vender packs de 15 videos a negocios." }] }
  ],
  tools: [
    { name: "ViralMoment", desc: "Tendencias IA", link: "https://www.viralmoment.com", icon: "chart" },
    { name: "Synclab", desc: "Lipsync IA", link: "https://www.synclab.ai", icon: "video" },
    { name: "CapCut AI", desc: "Edición automática", link: "https://www.capcut.com", icon: "video" }
  ],
  actionPlan: [
    { week: 1, title: "Dominar Herramientas", tasks: ["Crear 10 videos de prueba.", "Uso de plantillas."] },
    { week: 2, title: "Portafolio", tasks: ["Crear cuenta demo en TikTok.", "Subir mejores ejemplos."] },
    { week: 3, title: "Venta", tasks: ["Contactar 20 negocios locales."] },
    { week: 4, title: "Monetización", tasks: ["Venta de paquetes mensuales recurrentes."] }
  ]
};

// --- CURSO 5 ---
export const COURSE_5 = {
  id: "chatbots-negocios", // NUEVO ID
  title: "Chatbots IA para Negocios Locales",
  category: "Servicios",
  image: "https://images.unsplash.com/photo-1531746790731-6c087fecd65a?q=80&w=1000&auto=format&fit=crop",
  description: "Implementa asistentes virtuales que venden y reservan citas automáticamente.",
  isRichContent: true,
  price: 2.00,
  duration: "3 Semanas",
  syllabus: [
    { title: "Lógica", content: [{ subtitle: "Flujos de Conversación", text: "Diseñar árboles de decisión para ventas." }] },
    { title: "Implementación", content: [{ subtitle: "Sin Código", text: "Usar plataformas visuales drag-and-drop." }] }
  ],
  tools: [
    { name: "Botpress", desc: "Constructor potente", link: "https://botpress.com", icon: "code" },
    { name: "ManyChat", desc: "Marketing chat", link: "https://manychat.com", icon: "message" },
    { name: "Chatbase", desc: "IA entrenada con datos", link: "https://www.chatbase.co", icon: "brain" }
  ],
  actionPlan: [
    { week: 1, title: "Aprendizaje", tasks: ["Crear bot simple de FAQ.", "Probar en WhatsApp."] },
    { week: 2, title: "Producto Mínimo", tasks: ["Bot para restaurante (reservas)."] },
    { week: 3, title: "Prospección", tasks: ["Ofrecer demo gratis a 5 locales."] },
    { week: 4, title: "Monetización", tasks: ["Cobro por instalación + mantenimiento mensual."] }
  ]
};

// --- CURSO 6 ---
export const COURSE_6 = {
  id: "crear-cursos-ia", // NUEVO ID
  title: "Creación de Cursos Online con IA",
  category: "Educación",
  image: "https://images.unsplash.com/photo-1501504905252-473c47e087f8?q=80&w=1000&auto=format&fit=crop",
  description: "Convierte tu conocimiento en infoproductos rápidamente usando IA para guiones y slides.",
  isRichContent: true,
  price: 2.00,
  duration: "3 Semanas",
  syllabus: [{ title: "Curriculum", content: [{ subtitle: "Estructura", text: "Generar temarios lógicos con ChatGPT." }] }],
  tools: [
    { name: "Gamma App", desc: "Diapositivas automáticas", link: "https://gamma.app", icon: "presentation" },
    { name: "ElevenLabs", desc: "Narración", link: "https://elevenlabs.io", icon: "audio" }
  ],
  actionPlan: [
    { week: 1, title: "Planificación", tasks: ["Definir promesa del curso.", "Generar guiones."] },
    { week: 2, title: "Producción", tasks: ["Crear slides en Gamma.", "Grabar pantalla/voz."] },
    { week: 3, title: "Plataforma", tasks: ["Subir a Hotmart/Udemy."] },
    { week: 4, title: "Monetización", tasks: ["Ventas directas y afiliados."] }
  ]
};

// --- CURSO 7 ---
export const COURSE_7 = {
  id: "paginas-web-express", // NUEVO ID
  title: "Páginas Web Express con IA",
  category: "Desarrollo",
  image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1000&auto=format&fit=crop",
  description: "Crea sitios web profesionales en minutos y véndelos a emprendedores.",
  isRichContent: true,
  price: 2.00,
  duration: "1 Semana",
  syllabus: [{ title: "No-Code", content: [{ subtitle: "Generadores", text: "De texto a web publicada en segundos." }] }],
  tools: [
    { name: "Framer AI", desc: "Diseño web pro", link: "https://www.framer.com/ai", icon: "layout" },
    { name: "Wix AI", desc: "Constructor completo", link: "https://www.wix.com/ai", icon: "layout" }
  ],
  actionPlan: [
    { week: 1, title: "Dominio Herramienta", tasks: ["Crear 3 landing pages de ejemplo."] },
    { week: 2, title: "Oferta", tasks: ["Empaquetar servicio 'Web en 24h'."] },
    { week: 3, title: "Venta", tasks: ["Contactar profesionales sin web."] },
    { week: 4, title: "Monetización", tasks: ["Venta por proyecto ($50-$300)."] }
  ]
};

// --- CURSO 8 ---
export const COURSE_8 = {
  id: "dropshipping-ia", // NUEVO ID
  title: "Dropshipping Automatizado",
  category: "E-commerce",
  image: "https://images.unsplash.com/photo-1556742049-0cfed4f7a07d?q=80&w=1000&auto=format&fit=crop",
  description: "Encuentra productos ganadores y crea tiendas online autogestionadas.",
  isRichContent: true,
  price: 2.00,
  duration: "4 Semanas",
  syllabus: [{ title: "Productos", content: [{ subtitle: "Spy Tools", text: "Detectar qué se está vendiendo ahora mismo." }] }],
  tools: [
    { name: "Shopify Magic", desc: "E-commerce IA", link: "https://www.shopify.com", icon: "cart" },
    { name: "AdCreative", desc: "Anuncios IA", link: "https://adcreative.ai", icon: "image" }
  ],
  actionPlan: [
    { week: 1, title: "Selección", tasks: ["Elegir 5 productos potenciales."] },
    { week: 2, title: "Tienda", tasks: ["Configurar Shopify básica."] },
    { week: 3, title: "Ads", tasks: ["Lanzar campañas de prueba."] },
    { week: 4, title: "Monetización", tasks: ["Venta de productos o venta de la tienda llave en mano."] }
  ]
};

// --- CURSO 9 ---
export const COURSE_9 = {
  id: "copywriting-persuasion", // NUEVO ID
  title: "Copywriting y Persuasión IA",
  category: "Marketing",
  image: "https://images.unsplash.com/photo-1455390582262-044cdead277a?q=80&w=1000&auto=format&fit=crop",
  description: "Escribe textos que vendan para anuncios, emails y webs usando asistentes inteligentes.",
  isRichContent: true,
  price: 2.00,
  duration: "2 Semanas",
  syllabus: [{ title: "Prompt Engineering", content: [{ subtitle: "Contexto", text: "Cómo dar instrucciones precisas a la IA." }] }],
  tools: [
    { name: "Jasper", desc: "Copy marketing", link: "https://www.jasper.ai", icon: "pen" },
    { name: "Copy.ai", desc: "Generador rápido", link: "https://www.copy.ai", icon: "pen" }
  ],
  actionPlan: [
    { week: 1, title: "Fórmulas", tasks: ["Aprender AIDA y PAS con IA."] },
    { week: 2, title: "Servicio", tasks: ["Redactar emails de venta."] },
    { week: 3, title: "Freelance", tasks: ["Perfil en Upwork/Fiverr."] },
    { week: 4, title: "Monetización", tasks: ["Servicios de copywriter."] }
  ]
};

// --- CURSO 10 ---
export const COURSE_10 = {
  id: "newsletter-automatizada", // NUEVO ID
  title: "Newsletter Automatizada",
  category: "Media",
  image: "https://images.unsplash.com/photo-1586339949916-3e9457bef6d3?q=80&w=1000&auto=format&fit=crop",
  description: "Crea y crece una audiencia por correo electrónico con contenido curado por IA.",
  isRichContent: true,
  price: 2.00,
  duration: "3 Semanas",
  syllabus: [{ title: "Audiencia", content: [{ subtitle: "Lead Magnets", text: "Regalos digitales para conseguir suscriptores." }] }],
  tools: [
    { name: "Beehiiv", desc: "Plataforma Newsletter", link: "https://www.beehiiv.com", icon: "mail" },
    { name: "Substack", desc: "Publicación simple", link: "https://substack.com", icon: "mail" }
  ],
  actionPlan: [
    { week: 1, title: "Setup", tasks: ["Configurar landing page."] },
    { week: 2, title: "Contenido", tasks: ["Crear 4 ediciones con ChatGPT."] },
    { week: 3, title: "Tráfico", tasks: ["Promoción en redes."] },
    { week: 4, title: "Monetización", tasks: ["Suscripciones premium y patrocinios."] }
  ]
};

// --- CURSO 11 ---
export const COURSE_11 = {
  id: "crear-apps-saas", // NUEVO ID
  title: "Crear Apps SaaS (No-Code)",
  category: "Desarrollo",
  image: "https://images.unsplash.com/photo-1551650975-87deedd944c3?q=80&w=1000&auto=format&fit=crop",
  description: "Construye aplicaciones web funcionales sin saber programar código complejo.",
  isRichContent: true,
  price: 2.00,
  duration: "4 Semanas",
  syllabus: [{ title: "Lógica", content: [{ subtitle: "Bases de datos", text: "Entender cómo guardar información." }] }],
  tools: [
    { name: "Bubble", desc: "Apps complejas", link: "https://bubble.io", icon: "code" },
    { name: "Glide", desc: "Apps desde Excel", link: "https://www.glideapps.com", icon: "layout" }
  ],
  actionPlan: [
    { week: 1, title: "Idea", tasks: ["Definir problema a resolver."] },
    { week: 2, title: "Construcción", tasks: ["Frontend y Backend visual."] },
    { week: 3, title: "Beta", tasks: ["Test con usuarios."] },
    { week: 4, title: "Monetización", tasks: ["Suscripción mensual (SaaS)."] }
  ]
};

// --- CURSO 12 ---
export const COURSE_12 = {
  id: "negocios-influencers", // NUEVO ID
  title: "Negocios para Influencers IA",
  category: "Social",
  image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1000&auto=format&fit=crop",
  description: "Ayuda a creadores a gestionar su contenido y comunidad usando automatización.",
  isRichContent: true,
  price: 2.00,
  duration: "2 Semanas",
  syllabus: [{ title: "Gestión", content: [{ subtitle: "Repurposing", text: "Convertir 1 video en 10 piezas de contenido." }] }],
  tools: [
    { name: "Later AI", desc: "Programación", link: "https://later.com", icon: "calendar" },
    { name: "Lately", desc: "IA Social", link: "https://www.lately.ai", icon: "share" }
  ],
  actionPlan: [
    { week: 1, title: "Herramientas", tasks: ["Dominar la suite de gestión."] },
    { week: 2, title: "Oferta", tasks: ["Paquete de 'Gestión de Comunidad'."] },
    { week: 3, title: "Contacto", tasks: ["DM a micro-influencers."] },
    { week: 4, title: "Monetización", tasks: ["Consultoría mensual."] }
  ]
};

// --- CURSO 13 ---
export const COURSE_13 = {
  id: "redaccion-seo", // NUEVO ID
  title: "Redacción SEO con IA",
  category: "Marketing",
  image: "https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?q=80&w=1000&auto=format&fit=crop",
  description: "Posiciona webs en Google creando artículos optimizados masivamente.",
  isRichContent: true,
  price: 2.00,
  duration: "3 Semanas",
  syllabus: [{ title: "Google", content: [{ subtitle: "Keywords", text: "Qué busca la gente y cómo responder." }] }],
  tools: [
    { name: "Surfer SEO", desc: "Optimización", link: "https://surferseo.com", icon: "search" },
    { name: "Ahrefs", desc: "Análisis", link: "https://ahrefs.com", icon: "chart" }
  ],
  actionPlan: [
    { week: 1, title: "Investigación", tasks: ["Keyword Research."] },
    { week: 2, title: "Redacción", tasks: ["Artículos con ChatGPT + Humanización."] },
    { week: 3, title: "Publicación", tasks: ["Wordpress y formato."] },
    { week: 4, title: "Monetización", tasks: ["Venta de packs de artículos."] }
  ]
};

// --- CURSO 14 ---
export const COURSE_14 = {
  id: "libros-infantiles", // NUEVO ID
  title: "Libros Infantiles con IA",
  category: "E-Publishing",
  image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=1000&auto=format&fit=crop",
  description: "Crea cuentos ilustrados mágicos para niños y véndelos impresos bajo demanda.",
  isRichContent: true,
  price: 2.00,
  duration: "3 Semanas",
  syllabus: [{ title: "Storytelling", content: [{ subtitle: "Moralejas", text: "Crear historias con valor educativo." }] }],
  tools: [
    { name: "Midjourney", desc: "Ilustración consistente", link: "https://www.midjourney.com", icon: "image" },
    { name: "Amazon KDP", desc: "Impresión", link: "https://kdp.amazon.com", icon: "book" }
  ],
  actionPlan: [
    { week: 1, title: "Historia", tasks: ["Generar cuento con ChatGPT."] },
    { week: 2, title: "Ilustración", tasks: ["Generar personajes consistentes."] },
    { week: 3, title: "Maquetación", tasks: ["Canva Pro."] },
    { week: 4, title: "Monetización", tasks: ["Venta en KDP (Tapa blanda)."] }
  ]
};

// --- CURSO 15 ---
export const COURSE_15 = {
  id: "bots-whatsapp", // NUEVO ID
  title: "Bots de WhatsApp Ventas",
  category: "Ventas",
  image: "https://images.unsplash.com/photo-1611746347164-c23c43118906?q=80&w=1000&auto=format&fit=crop",
  description: "Automatiza la atención al cliente en WhatsApp para negocios.",
  isRichContent: true,
  price: 2.00,
  duration: "3 Semanas",
  syllabus: [{ title: "WhatsApp API", content: [{ subtitle: "Reglas", text: "Qué se puede y qué no hacer." }] }],
  tools: [
    { name: "WATI", desc: "WhatsApp API", link: "https://www.wati.io", icon: "message" },
    { name: "Twilio", desc: "Conexión", link: "https://www.twilio.com", icon: "code" }
  ],
  actionPlan: [
    { week: 1, title: "Configuración", tasks: ["Obtener número API."] },
    { week: 2, title: "Flujos", tasks: ["Diseñar menú de opciones."] },
    { week: 3, title: "Venta", tasks: ["Demo a restaurantes."] },
    { week: 4, title: "Monetización", tasks: ["Setup fee + mensualidad."] }
  ]
};

// AGRUPAMOS TODOS PARA EXPORTARLOS
export const ALL_COURSES = [
  COURSE_1, COURSE_2, COURSE_3, COURSE_4, COURSE_5,
  COURSE_6, COURSE_7, COURSE_8, COURSE_9, COURSE_10,
  COURSE_11, COURSE_12, COURSE_13, COURSE_14, COURSE_15
];