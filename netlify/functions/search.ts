
import { Handler } from '@netlify/functions';

export const handler: Handler = async (event) => {
  // Manejo de CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
      },
      body: '',
    };
  }

  const { query, network } = event.queryStringParameters || {};

  if (!query || !network) {
    return { 
      statusCode: 400, 
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ error: 'Missing query or network parameter' }) 
    };
  }

  // Extraemos las variables con nombres exactos a los que configuramos
  const RAKUTEN_TOKEN = process.env.RAKUTEN_ACCESS_TOKEN;
  const AWIN_TOKEN = process.env.AWIN_API_TOKEN;
  const AWIN_PUB_ID = process.env.AWIN_PUBLISHER_ID;
  const SKIM_KEY = process.env.SKIMLINKS_API_KEY;
  const SKIM_PUB_ID = process.env.SKIMLINKS_PUBLISHER_ID;

  console.log(`[Backend] Buscando en ${network} para: ${query}`);

  try {
    let apiUrl = '';
    let headers: Record<string, string> = { 'Accept': 'application/json' };

    // Validación de configuración por red
    if (network === 'rakuten') {
      if (!RAKUTEN_TOKEN) throw new Error('RAKUTEN_ACCESS_TOKEN not configured');
      apiUrl = `https://api.rakutenmarketing.com/productsearch/1.0?keyword=${encodeURIComponent(query)}`;
      headers['Authorization'] = `Bearer ${RAKUTEN_TOKEN}`;
    } 
    else if (network === 'awin') {
      if (!AWIN_TOKEN || !AWIN_PUB_ID) throw new Error('AWIN credentials not configured');
      apiUrl = `https://api.awin.com/publisher/${AWIN_PUB_ID}/productdb/search?searchTerm=${encodeURIComponent(query)}&limit=10`;
      headers['Authorization'] = `Bearer ${AWIN_TOKEN}`;
    }
    else if (network === 'skimlinks') {
      if (!SKIM_KEY || !SKIM_PUB_ID) throw new Error('SKIMLINKS credentials not configured');
      // URL de Skimlinks (sin filtrar por país para asegurar resultados en la prueba)
      apiUrl = `https://api-search.skimlinks.com/v1/products?key=${SKIM_KEY}&publisher_id=${SKIM_PUB_ID}&q=${encodeURIComponent(query)}&limit=25`;
    }
    else {
      throw new Error(`Unsupported network: ${network}`);
    }

    const response = await fetch(apiUrl, { headers });
    
    // Si la API externa responde pero no es un 200 (ej. 401 Unauthorized)
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[Backend] ${network} API returned ${response.status}:`, errorText);
      return {
        statusCode: response.status,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify({ error: `API ${network} error: ${response.status}`, details: errorText })
      };
    }

    const data = await response.json();
    
    return {
      statusCode: 200,
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*' 
      },
      body: JSON.stringify(data)
    };

  } catch (error: any) {
    console.error(`[Backend] Critical Error in ${network}:`, error.message);
    return { 
      statusCode: 500, 
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ error: error.message, network }) 
    };
  }
};
