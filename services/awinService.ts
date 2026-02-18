
import { ProductMatch, FashionItem } from "../types";

// Los valores reales deben configurarse en el entorno de despliegue
const AWIN_API_TOKEN = (process.env as any).AWIN_API_TOKEN || 'TU_AWIN_API_TOKEN';
const AWIN_PUBLISHER_ID = (process.env as any).AWIN_PUBLISHER_ID || 'TU_PUBLISHER_ID';

/**
 * Busca productos en la red de Awin basados en la descripción del ítem de moda.
 * Nota: La API de búsqueda de Awin suele requerir parámetros específicos de región y anunciante.
 */
export async function searchAwinProducts(item: FashionItem): Promise<ProductMatch[]> {
  try {
    // Awin Product Search API Endpoint
    // Documentación: https://wiki.awin.com/index.php/API_get_productdb
    const url = new URL('https://api.awin.com/publisher/' + AWIN_PUBLISHER_ID + '/productdb/search');
    
    url.searchParams.append('searchTerm', item.query);
    url.searchParams.append('limit', '10');
    // url.searchParams.append('advertiserId', '123,456'); // Opcional: filtrar por anunciantes específicos

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${AWIN_API_TOKEN}`,
        'Accept': 'application/json',
      }
    });

    if (!response.ok) {
      if (response.status === 401) console.error("Awin API: Unauthorized. Check Token.");
      return [];
    }

    const data = await response.json();

    // Mapeo del esquema de Awin al de nuestra App
    // Awin devuelve típicamente: { products: [ { productName, aw_deep_link, merchantName, price, ... } ] }
    if (!data.products || !Array.isArray(data.products)) return [];

    return data.products.map((p: any, index: number) => ({
      id: p.productId || `awin-${index}`,
      title: p.productName,
      store: p.merchantName,
      price: parseFloat(p.priceValue) || 0,
      oldPrice: p.oldPriceValue ? parseFloat(p.oldPriceValue) : undefined,
      imageUrl: p.imageUrl || p.aw_image_url,
      affiliateUrl: p.aw_deep_link, // Enlace de afiliado directo
      isBestMatch: index === 0,
      isOnSale: !!p.oldPriceValue
    }));
  } catch (error) {
    console.error("Error connecting to Awin API:", error);
    return [];
  }
}
