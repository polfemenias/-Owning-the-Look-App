
import { ProductMatch, FashionItem } from "../types";

export async function searchSkimlinksProducts(item: FashionItem): Promise<ProductMatch[]> {
  try {
    // Ahora llamamos a nuestra función segura de Netlify
    const response = await fetch(`/.netlify/functions/search?network=skimlinks&query=${encodeURIComponent(item.query)}`);

    if (!response.ok) return [];

    const data = await response.json();
    
    // Mapeo de la estructura de Skimlinks a ProductMatch
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
    console.error("Error fetching from Skimlinks:", error);
    return [];
  }
}
