
import { ProductMatch, FashionItem } from "../types";

export async function searchRakutenProducts(item: FashionItem): Promise<ProductMatch[]> {
  try {
    // Llamamos a nuestra propia Netlify Function
    const response = await fetch(`/.netlify/functions/search?network=rakuten&query=${encodeURIComponent(item.query)}`);
    
    if (!response.ok) return [];

    const data = await response.json();
    
    // Mapeo basado en la estructura de Rakuten Product Search API
    if (!data.result || !data.result.items) return [];

    return data.result.items.map((p: any, index: number) => ({
      id: p.mid + '-' + p.productname.substring(0,5),
      title: p.productname,
      store: p.merchantname,
      price: parseFloat(p.price) || 0,
      imageUrl: p.imageurl,
      affiliateUrl: p.linkurl,
      isBestMatch: index === 0,
      isOnSale: false
    }));
  } catch (error) {
    console.error("Rakuten Search Error:", error);
    return [];
  }
}
