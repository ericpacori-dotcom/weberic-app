// src/content/ai_tools_data.js

export const TOOL_CATEGORIES = [
  { id: 'all', label: 'Todas', icon: 'Sparkles' },
  { id: 'image', label: 'Crear Imágenes', icon: 'Image' },
  { id: 'video', label: 'Video & Animación', icon: 'Video' },
  { id: 'automation', label: 'Automatización', icon: 'Bot' },
  { id: '3d', label: 'Objetos 3D', icon: 'Box' },
];

export const AI_TOOLS_DATA = [
  // --- MIDJOURNEY ---
  {
    id: 'midjourney',
    name: 'Midjourney',
    category: 'image',
    icon: 'https://upload.wikimedia.org/wikipedia/commons/e/ed/Midjourney_Emblem.png',
    shortDesc: 'La IA líder indiscutible en generación artística y fotorealismo.',
    description: 'Midjourney v6 es actualmente el motor de generación de imágenes más potente del mercado. Funciona a través de Discord y destaca por su comprensión de la iluminación cinematográfica, texturas realistas y estilos artísticos complejos.',
    
    // NUEVO: VIDEO DE DEMOSTRACIÓN (Youtube Embed URL)
    videoUrl: 'https://www.youtube.com/embed/hC6t1Zys55Y?si=StartMidjourney', 
    
    // NUEVO: GALERÍA DE EJEMPLOS
    gallery: [
      'https://images.unsplash.com/photo-1695653422634-192c73eb2396?q=80&w=1000&auto=format&fit=crop', // Cyberpunk
      'https://images.unsplash.com/photo-1683009427513-28e163402d16?q=80&w=1000&auto=format&fit=crop', // Retrato
      'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1000&auto=format&fit=crop'  // Abstracto
    ],

    features: [
      'Fotorealismo V6: Piel y texturas indistinguibles de la realidad.',
      'Zoom Out / Pan: Expande la imagen hacia los lados o aléjala.',
      'Vary Region: Cambia solo una parte específica de la imagen.',
      'Style Tuner: Crea tu propio "filtro" o estilo visual único.'
    ],
    tips: [
      'Usa el parámetro --ar 16:9 al final para formato cine o --ar 9:16 para Reels/TikTok.',
      'El parámetro --stylize (0-1000) controla la creatividad. Usa --s 750 para resultados muy artísticos.',
      'Usa --weird (0-3000) para generar conceptos extraños y únicos.'
    ],
    prompts: [
      'Hyper-realistic close-up portrait of an elderly fisherman, detailed wrinkles, stormy ocean background, cinematic lighting, shot on 35mm lens --ar 4:5 --v 6.0',
      'Flat vector logo of a minimalist fox head, orange and white, simple geometric shapes, white background --no shading detail'
    ],
    link: 'https://www.midjourney.com'
  },

  // --- DALL-E 3 ---
  {
    id: 'dalle3',
    name: 'DALL·E 3',
    category: 'image',
    icon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4d/OpenAI_Logo.svg/1024px-OpenAI_Logo.svg.png',
    shortDesc: 'La mejor para seguir instrucciones exactas y escribir texto.',
    description: 'Desarrollada por OpenAI e integrada en ChatGPT. Su mayor fortaleza es que "entiende" lo que pides mucho mejor que otras IAs y es capaz de generar texto legible dentro de las imágenes (carteles, logos, etiquetas).',
    
    videoUrl: 'https://www.youtube.com/embed/SQoA_wzcE9A?si=Dalle3Demo',
    
    gallery: [
      'https://images.unsplash.com/photo-1541701494587-cb58502866ab?q=80&w=1000&auto=format&fit=crop', // Arte abstracto
      'https://plus.unsplash.com/premium_photo-1683121366070-5ceb7e007a97?q=80&w=1000&auto=format&fit=crop' // Ilustración
    ],

    features: [
      'Integración Conversacional: Habla con ChatGPT para refinar la imagen.',
      'Texto Legible: Crea posters o cómics con palabras correctas.',
      'Consistencia: Pide "mismo personaje" y mantiene rasgos similares.',
      'Seguridad: Filtros avanzados para evitar contenido inapropiado.'
    ],
    tips: [
      'No necesitas prompts técnicos. Describe la imagen como si se la contaras a un amigo.',
      'Si quieres corregir algo, solo dile: "Cambia el color del auto a rojo", no necesitas reescribir todo.',
      'Pide formatos específicos: "Ratio panorámico" o "Formato cuadrado".'
    ],
    prompts: [
      'Un póster de película vintage de los años 80 con el título "HAERIC AI" escrito en letras neón brillantes en la parte superior, fondo de ciudad futurista.',
      'Ilustración estilo corte transversal de una casa subterránea de hobbit, muy detallada, estilo libro de cuentos infantiles.'
    ],
    link: 'https://openai.com/dall-e-3'
  },

  // --- RUNWAY ---
  {
    id: 'runway',
    name: 'Runway Gen-2',
    category: 'video',
    icon: 'https://images.crunchbase.com/image/upload/c_lpad,f_auto,q_auto:eco,dpr_1/v1486646872/k1x9k8g9k8g9k8g9k8g9.png', // Placeholder logo
    shortDesc: 'Generación de video profesional y edición mágica.',
    description: 'Runway es una suite de edición de video con IA. Su modelo Gen-2 permite crear videos desde cero usando texto (Text-to-Video) o animar imágenes estáticas (Image-to-Video) con control total del movimiento.',
    
    videoUrl: 'https://www.youtube.com/embed/704y3aG7q6o?si=RunwayDemo',
    
    gallery: [
      'https://images.unsplash.com/photo-1535016120720-40c6874c3b1c?q=80&w=1000&auto=format&fit=crop', // Cinematic
      'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1000&auto=format&fit=crop'  // Motion
    ],

    features: [
      'Motion Brush: Pinta un área de la foto para que solo esa parte se mueva (ej: nubes, agua).',
      'Text-to-Video: "Un dron volando sobre Marte".',
      'Green Screen AI: Elimina el fondo de cualquier video en un clic.',
      'Inpainting: Borra personas u objetos de un video automáticamente.'
    ],
    tips: [
      'Para mejores resultados, usa Image-to-Video en lugar de solo texto. Sube una imagen generada en Midjourney y anímala aquí.',
      'Usa el control "Camera Motion" para simular zoom o paneos de cámara reales.',
      'Los videos son cortos (4s), úsalos como B-Roll o clips de stock.'
    ],
    prompts: [
      '(Text to Video): Cinematic drone shot flying rapidly through a canyon at sunset, 4k resolution.',
      '(Image to Video): Usa Motion Brush en el agua del río para que fluya hacia la derecha.'
    ],
    link: 'https://runwayml.com'
  },

  // --- ZAPIER ---
  {
    id: 'zapier',
    name: 'Zapier AI',
    category: 'automation',
    icon: 'https://images.ctfassets.net/lzny33ho1g45/T4M9c8k10c7j8k45/9a8b/zapier-logo.png',
    shortDesc: 'El pegamento de internet, ahora con cerebro IA.',
    description: 'Zapier conecta más de 6,000 aplicaciones. Con sus nuevas funciones de IA, puedes crear automatizaciones describiéndolas en lenguaje natural o usar ChatGPT para ejecutar acciones en tus otras apps.',
    
    videoUrl: 'https://www.youtube.com/embed/8G2Q2t5G2G2?si=ZapierAI',
    
    gallery: [
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1000&auto=format&fit=crop', // Dashboard
    ],

    features: [
      'Zapier Tables: Bases de datos ligeras integradas.',
      'Interfaces: Crea pequeños portales web para tus bots.',
      'ChatGPT Plugin: Pídele a ChatGPT que busque un email o añada una fila en Excel.',
      'Formatter AI: Limpia y da formato a textos o teléfonos automáticamente.'
    ],
    tips: [
      'Conecta OpenAI (GPT) en medio de un Zap para analizar el sentimiento de un correo antes de responder.',
      'Usa "Paths" para crear caminos diferentes: Si el cliente es VIP, manda Slack; si no, solo email.'
    ],
    prompts: [
      '(Lógica): "Cada vez que reciba un lead en Facebook Ads, usa ChatGPT para escribir un saludo personalizado y envíalo por Gmail."',
      '(Data): "Extrae el nombre y la fecha de este email desordenado y ponlo en Google Sheets."'
    ],
    link: 'https://zapier.com'
  }
];