// UBICACIÓN: src/utils/newsService.js

export const fetchAINews = async () => {
  // URL del RSS de Google News filtrado por "Inteligencia Artificial" en Español
  const RSS_URL = "https://news.google.com/rss/search?q=Inteligencia+Artificial+site:es&hl=es-419&gl=PE&ceid=PE:es-419";
  
  // Usamos rss2json para convertir el XML a JSON que React pueda leer
  const API_ENDPOINT = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(RSS_URL)}`;

  try {
    const response = await fetch(API_ENDPOINT);
    const data = await response.json();

    if (data.status === 'ok') {
      return data.items.map(item => {
        // Extraemos el dominio para buscar el logo (ej: xataka.com)
        const domain = new URL(item.link).hostname;
        
        return {
          title: item.title,
          link: item.link,
          pubDate: item.pubDate,
          author: item.author || "Redacción",
          // Truco de Google para sacar el favicon/logo de cualquier web
          sourceIcon: `https://www.google.com/s2/favicons?domain=${domain}&sz=128`,
          sourceName: domain.replace('www.', '')
        };
      });
    }
    return [];
  } catch (error) {
    console.error("Error cargando noticias:", error);
    return [];
  }
};