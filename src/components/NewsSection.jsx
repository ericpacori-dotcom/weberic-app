import React, { useState, useEffect } from 'react';
import { ExternalLink, Loader, Calendar, ImageIcon } from 'lucide-react';

// --- PALETA HAERIC1 (Consistente con App.jsx) ---
const COLORS = {
  bgCard: "bg-[#486581]",       // Azul Medio
  bgDark: "bg-[#334E68]",       // Azul Profundo
  textLight: "text-[#F0F4F8]",  // Claro
  textMuted: "text-[#BCCCDC]",  // Gris Azulado
  accentOrange: "text-[#F9703E]", // Naranja Texto
  borderSoft: "border-[#627D98]", // Bordes suaves
};

const NewsSection = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  // Función auxiliar para "cazar" la imagen dentro del HTML de Google News
  const extractImage = (item) => {
    // 1. Intenta sacar la imagen oficial (enclosure)
    if (item.enclosure && item.enclosure.link) return item.enclosure.link;
    if (item.thumbnail) return item.thumbnail;
    
    // 2. Si no hay, busca dentro del contenido HTML (description) usando una expresión regular
    // Google suele poner la imagen en una etiqueta <img src="...">
    const imgInDescription = item.description?.match(/<img[^>]+src="([^">]+)"/);
    if (imgInDescription) return imgInDescription[1];

    // 3. Si falla todo, retorna null (usaremos fallback después)
    return null;
  };

  useEffect(() => {
    const fetchNews = async () => {
      try {
        // Feed de Google News filtrado por IA y Tecnología
        const RSS_URL = `https://news.google.com/rss/search?q=Inteligencia+Artificial+tecnologia&hl=es-419&gl=PE&ceid=PE:es-419`;
        // Usamos rss2json para convertirlo a JSON utilizable
        const API_URL = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(RSS_URL)}`;

        const response = await fetch(API_URL);
        const data = await response.json();

        if (data.status === 'ok') {
          const cleanNews = data.items.slice(0, 6).map((item, index) => {
            const foundImage = extractImage(item);
            
            return {
              id: index,
              title: item.title,
              link: item.link,
              date: new Date(item.pubDate).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' }),
              source: item.source || "Noticias IA",
              // Si encontramos imagen, la usamos. Si no, ponemos una tecnológica de alta calidad de Unsplash.
              image: foundImage || `https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&auto=format&fit=crop&q=60`
            };
          });
          setNews(cleanNews);
        } else {
          throw new Error("Error en feed");
        }
      } catch (err) {
        console.error("Error cargando noticias:", err);
        // DATOS DE PRUEBA (Por si falla la API, para que nunca se vea vacío)
        setNews([
            { id: 1, title: "La revolución de la IA Generativa: Lo que se viene para los creadores", date: "Hoy", source: "TechCrunch", link: "#", image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&auto=format&fit=crop&q=60" },
            { id: 2, title: "Nuevas herramientas de OpenAI permiten clonar voces con precisión", date: "Ayer", source: "Forbes", link: "#", image: "https://images.unsplash.com/photo-1555255707-c07966088b7b?w=800&auto=format&fit=crop&q=60" },
            { id: 3, title: "Guía para automatizar tu negocio usando agentes inteligentes", date: "Hace 2d", source: "Wired", link: "#", image: "https://images.unsplash.com/photo-1531746790731-6c087fecd65a?w=800&auto=format&fit=crop&q=60" }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  return (
    <div className="w-full max-w-7xl mx-auto px-6 py-20 relative z-20">
      
      {/* CABECERA DE SECCIÓN */}
      <div className="flex items-center gap-4 mb-10 animate-fade-in-up">
        <div className="h-10 w-2 bg-[#F9703E] rounded-full shadow-[0_0_15px_rgba(249,112,62,0.5)]"></div>
        <h2 className={`text-4xl font-black ${COLORS.textLight} tracking-tight`}>
          Actualidad <span className={COLORS.accentOrange}>IA</span>
        </h2>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader className={`animate-spin ${COLORS.accentOrange}`} size={40} />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {news.map((item, index) => (
            <a 
              key={item.id} 
              href={item.link} 
              target="_blank" 
              rel="noopener noreferrer"
              className={`group relative ${COLORS.bgCard} border border-[#627D98] rounded-[2rem] overflow-hidden hover:border-[#F9703E] transition-all duration-500 hover:-translate-y-2 shadow-xl hover:shadow-2xl flex flex-col h-[400px] animate-fade-in-up`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* --- ZONA DE IMAGEN DE PORTADA (Titular Visual) --- */}
              <div className="h-1/2 w-full overflow-hidden relative">
                {/* Capa oscura degradada sobre la imagen para que resalte la etiqueta */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#486581] to-transparent opacity-60 z-10"></div>
                
                <img 
                  src={item.image} 
                  alt={item.title} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  onError={(e) => {e.target.src = 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&auto=format&fit=crop&q=60'}} // Fallback final
                />
                
                {/* Etiqueta de la Fuente (Flotando sobre la imagen) */}
                <div className="absolute top-4 left-4 z-20">
                  <span className={`text-[10px] font-black uppercase tracking-wider ${COLORS.bgDark} ${COLORS.accentOrange} px-3 py-1.5 rounded-full border border-[#627D98] shadow-lg backdrop-blur-md bg-opacity-90`}>
                    {item.source}
                  </span>
                </div>
              </div>

              {/* --- ZONA DE CONTENIDO (Texto) --- */}
              <div className="p-6 flex flex-col flex-1 justify-between relative z-20 bg-[#486581]">
                <div>
                  {/* Título Grande y Completo */}
                  <h3 className={`text-lg font-bold ${COLORS.textLight} mb-3 leading-snug group-hover:text-[#F9703E] transition-colors line-clamp-3`}>
                    {item.title}
                  </h3>
                </div>

                <div className={`flex items-center justify-between mt-auto pt-4 border-t ${COLORS.borderSoft} ${COLORS.textMuted} text-xs font-bold uppercase tracking-wider`}>
                  <div className="flex items-center gap-2">
                    <Calendar size={14} className={COLORS.accentOrange} />
                    <span>{item.date}</span>
                  </div>
                  <div className="flex items-center gap-1 group-hover:text-white transition-colors">
                    LEER <ExternalLink size={14} />
                  </div>
                </div>
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
};

export default NewsSection;