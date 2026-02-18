
import { Handler } from '@netlify/functions';

export const handler: Handler = async (event) => {
  const { query, network } = event.queryStringParameters || {};

  if (!query) {
    return { statusCode: 400, body: JSON.stringify({ error: 'Missing query' }) };
  }

  // Credenciales desde variables de entorno (Configuradas en el panel de Netlify)
  const RAKUTEN_TOKEN = process.env.RAKUTEN_ACCESS_TOKEN || 'bWhHYx2DVKPvGwpaar9QVA2e4k6odLFI';
  const AWIN_TOKEN = process.env.AWIN_API_TOKEN || '3bf93b8c-4cb4-4c7f-b9ac-7cdfe37da19f';
  const AWIN_PUB_ID = process.env.AWIN_PUBLISHER_ID || '1312503';

  try {
    if (network === 'rakuten') {
      // API de Rakuten Product Search
      const response = await fetch(`https://api.rakutenmarketing.com/productsearch/1.0?keyword=${encodeURIComponent(query)}`, {
        headers: { 'Authorization': `Bearer ${RAKUTEN_TOKEN}` }
      });
      const data = await response.json();
      return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify(data)
      };
    } 
    
    if (network === 'awin') {
      const response = await fetch(`https://api.awin.com/publisher/${AWIN_PUB_ID}/productdb/search?searchTerm=${encodeURIComponent(query)}&limit=10`, {
        headers: { 'Authorization': `Bearer ${AWIN_TOKEN}`, 'Accept': 'application/json' }
      });
      const data = await response.json();
      return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify(data)
      };
    }

    return { statusCode: 400, body: 'Invalid network' };
  } catch (error) {
    return { statusCode: 500, body: JSON.stringify({ error: 'Failed to fetch' }) };
  }
};
