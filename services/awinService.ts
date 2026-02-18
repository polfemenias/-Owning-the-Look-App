
import { ProductMatch, FashionItem } from "../types";

export async function searchAwinProducts(item: FashionItem): Promise<ProductMatch[]> {
  try {
    const response = await fetch(`/.netlify/functions/search?network=awin&query=${encodeURIComponent(item.query)}`);

    if (!response.ok) return [];

    const data = await response.json();

    if (!data.products || !Array.isArray(data.products)) return [];

    return data.products.map((p: any) => ({
      id: p.productId?.toString(),
      title: p.productName,
      store: p.merchantName,
      price: parseFloat(p.priceValue) || 0,
      oldPrice: p.oldPriceValue ? parseFloat(p.oldPriceValue) : undefined,
      imageUrl: p.imageUrl || p.aw_image_url,
      affiliateUrl: p.aw_deep_link,
      isBestMatch: false,
      isOnSale: !!p.oldPriceValue
    }));
  } catch (error) {
    console.error("Awin Search Error:", error);
    return [];
  }
}
