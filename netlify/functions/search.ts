
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

  try {
    let apiUrl = '';
    let headers: Record<string, string> = { 'Accept': 'application/json' };

    if (network === 'amazon') {
      const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY;
      if (!RAPIDAPI_KEY) throw new Error('RAPIDAPI_KEY is missing');
      
      apiUrl = `https://real-time-amazon-data.p.rapidapi.com/search?query=${encodeURIComponent(query)}&page=1&country=US`;
      headers['x-rapidapi-host'] = 'real-time-amazon-data.p.rapidapi.com';
      headers['x-rapidapi-key'] = RAPIDAPI_KEY;
    }
    else {
      throw new Error(`Unsupported network: ${network}`);
    }

    console.log(`[Backend] Fetching ${network}: ${apiUrl.split('?')[0]}`);
    
    const response = await fetch(apiUrl, { headers });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[Backend] ${network} API Error ${response.status}:`, errorText);
      return {
        statusCode: response.status,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify({ 
          error: `Network ${network} returned ${response.status}`,
          isConfigError: response.status === 401 || response.status === 403 || response.status === 404
        })
      };
    }

    const data = await response.json();
    
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify(data)
    };

  } catch (error: any) {
    console.error(`[Backend] Exception in ${network}:`, error.message);
    return { 
      statusCode: 500, 
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ error: error.message, network }) 
    };
  }
};
