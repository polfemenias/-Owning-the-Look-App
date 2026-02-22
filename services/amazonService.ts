
import { ProductMatch, FashionItem } from "../types";

export async function searchAmazonProducts(item: FashionItem): Promise<ProductMatch[]> {
  try {
    const searchTerms = item.query.split(' ');
    const optimizedQuery = searchTerms.length > 2 ? searchTerms.slice(0, 2).join(' ') : item.query;
    
    // Petición al backend PHP local
    const response = await fetch(`buscador.php?q=${encodeURIComponent(optimizedQuery)}`);

    if (!response.ok) {
      console.warn(`[Search] API Error: ${response.status}`);
      return [];
    }

    const data = await response.json();
    
    // Estructura esperada: [ { "title": "...", "price": "...", "img": "...", "link": "..." }, ... ]
    if (!Array.isArray(data)) {
      return [];
    }

    return data.map((p: any, index: number) => ({
      id: `prod-${index}-${Date.now()}`,
      title: p.title,
      store: 'Amazon',
      price: p.price, // String con símbolo (ej: "$45.00")
      imageUrl: p.img,
      affiliateUrl: p.link,
      isBestMatch: index === 0,
      isOnSale: false
    }));
  } catch (error) {
    console.error("[Search] error:", error);
    return [];
  }
}
