
import { Handler } from '@netlify/functions';

export const handler: Handler = async (event) => {
  const { query, network } = event.queryStringParameters || {};

  if (!query) {
    return { statusCode: 400, body: JSON.stringify({ error: 'Missing query' }) };
  }

  // Credenciales desde variables de entorno
  const RAKUTEN_TOKEN = process.env.RAKUTEN_ACCESS_TOKEN;
  const AWIN_TOKEN = process.env.AWIN_API_TOKEN;
  const AWIN_PUB_ID = process.env.AWIN_PUBLISHER_ID;
  const SKIM_KEY = process.env.SKIMLINKS_API_KEY;
  const SKIM_PUB_ID = process.env.SKIMLINKS_PUBLISHER_ID;

  try {
    let response;
    let data;

    if (network === 'rakuten' && RAKUTEN_TOKEN) {
      response = await fetch(`https://api.rakutenmarketing.com/productsearch/1.0?keyword=${encodeURIComponent(query)}`, {
        headers: { 'Authorization': `Bearer ${RAKUTEN_TOKEN}` }
      });
      data = await response.json();
    } 
    
    else if (network === 'awin' && AWIN_TOKEN && AWIN_PUB_ID) {
      response = await fetch(`https://api.awin.com/publisher/${AWIN_PUB_ID}/productdb/search?searchTerm=${encodeURIComponent(query)}&limit=10`, {
        headers: { 'Authorization': `Bearer ${AWIN_TOKEN}`, 'Accept': 'application/json' }
      });
      data = await response.json();
    }

    else if (network === 'skimlinks' && SKIM_KEY && SKIM_PUB_ID) {
      // API de Skimlinks: Búsqueda de productos
      const skimUrl = `https://api-search.skimlinks.com/v1/products?key=${SKIM_KEY}&publisher_id=${SKIM_PUB_ID}&q=${encodeURIComponent(query)}&limit=10&country=US`;
      response = await fetch(skimUrl);
      data = await response.json();
    }

    if (!response || !response.ok) {
      return { 
        statusCode: response?.status || 500, 
        body: JSON.stringify({ error: 'Partner API error or missing configuration' }) 
      };
    }

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify(data)
    };

  } catch (error: any) {
    return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
  }
};
