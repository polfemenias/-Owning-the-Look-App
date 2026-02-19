
import { ProductMatch, FashionItem } from "../types";

export async function searchSkimlinksProducts(item: FashionItem): Promise<ProductMatch[]> {
  try {
    const searchTerms = item.query.split(' ');
    const optimizedQuery = searchTerms.length > 3 ? searchTerms.slice(0, 3).join(' ') : item.query;

    console.log(`[Skimlinks] Requesting: "${optimizedQuery}"`);

    const response = await fetch(`/.netlify/functions/search?network=skimlinks&query=${encodeURIComponent(optimizedQuery)}`);

    // Verificamos si la respuesta es JSON antes de parsear
    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      const textError = await response.text();
      console.error("[Skimlinks] Server didn't return JSON. Response:", textError.substring(0, 100));
      return [];
    }

    const data = await response.json();
    
    if (data.error) {
      console.error("[Skimlinks] Error desde el servidor:", data.error);
      return [];
    }

    if (!data.products || !Array.isArray(data.products)) {
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
    console.error("[Skimlinks] Fetch failed:", error);
    return [];
  }
}
