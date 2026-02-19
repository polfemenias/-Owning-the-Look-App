
import { ProductMatch, FashionItem } from "../types";

export async function searchSkimlinksProducts(item: FashionItem): Promise<ProductMatch[]> {
  try {
    // Limpiamos la query: la IA a veces es demasiado específica. 
    // Si la query tiene más de 4 palabras, probamos con una versión más corta.
    const searchTerms = item.query.split(' ');
    const optimizedQuery = searchTerms.length > 3 ? searchTerms.slice(0, 3).join(' ') : item.query;

    console.log(`[Skimlinks] Buscando: "${optimizedQuery}" (Original: "${item.query}")`);

    const response = await fetch(`/.netlify/functions/search?network=skimlinks&query=${encodeURIComponent(optimizedQuery)}`);

    if (!response.ok) {
      const errorData = await response.json();
      console.error("[Skimlinks] Error en la función de Netlify:", errorData);
      return [];
    }

    const data = await response.json();
    console.log("[Skimlinks] Respuesta cruda de la API:", data);
    
    if (!data.products || !Array.isArray(data.products)) {
      console.warn("[Skimlinks] No se encontraron productos o el formato es incorrecto.");
      return [];
    }

    return data.products.map((p: any, index: number) => ({
      id: p.id || `skim-${index}`,
      title: p.title,
      store: p.merchant_name || 'Partner Store',
      price: parseFloat(p.price) || 0,
      oldPrice: p.price_old ? parseFloat(p.price_old) : undefined,
      imageUrl: p.image_url || `https://picsum.photos/seed/${p.id}/400/550`,
      affiliateUrl: p.url,
      isBestMatch: false,
      isOnSale: !!p.price_old && parseFloat(p.price_old) > parseFloat(p.price)
    }));
  } catch (error) {
    console.error("[Skimlinks] Error fatal en el servicio:", error);
    return [];
  }
}
