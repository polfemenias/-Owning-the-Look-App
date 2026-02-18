
import { ProductMatch, FashionItem } from "../types";

// Nota: En producción, estos valores deben venir de process.env
const SKIMLINKS_API_KEY = (process.env as any).SKIMLINKS_API_KEY || 'TU_API_KEY_AQUI';
const SKIMLINKS_PUBLISHER_ID = (process.env as any).SKIMLINKS_PUBLISHER_ID || 'TU_PUBLISHER_ID_AQUI';
const DEFAULT_COUNTRY = 'ES'; // O el país que prefieras

export async function searchSkimlinksProducts(item: FashionItem): Promise<ProductMatch[]> {
  try {
    const url = new URL('https://api-search.skimlinks.com/v1/products');
    url.searchParams.append('key', SKIMLINKS_API_KEY);
    url.searchParams.append('publisher_id', SKIMLINKS_PUBLISHER_ID);
    url.searchParams.append('q', item.query);
    url.searchParams.append('limit', '12');
    url.searchParams.append('country', DEFAULT_COUNTRY);

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      }
    });

    if (!response.ok) {
      throw new Error(`Skimlinks API error: ${response.statusText}`);
    }

    const data = await response.json();
    
    // Mapeamos los productos de Skimlinks a nuestro formato ProductMatch
    // Asumiendo la estructura típica de la respuesta de Skimlinks
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
      affiliateUrl: p.url, // Este es el link que el usuario usará para comprar
      isBestMatch: index === 0,
      isOnSale: !!p.price_old && parseFloat(p.price_old) > parseFloat(p.price)
    }));
  } catch (error) {
    console.error("Error fetching from Skimlinks:", error);
    return []; // Devolvemos vacío para que el componente decida si usar mocks
  }
}
