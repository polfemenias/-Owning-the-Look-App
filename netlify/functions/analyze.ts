
import { Handler } from '@netlify/functions';
import { GoogleGenAI, Type } from "@google/genai";

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const { image } = JSON.parse(event.body || '{}');
  const API_KEY = process.env.GEMINI_API_KEY;

  if (!API_KEY) {
    return { statusCode: 500, body: JSON.stringify({ error: 'GEMINI_API_KEY not configured in Netlify' }) };
  }

  const ai = new GoogleGenAI({ apiKey: API_KEY });

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: {
        parts: [
          { inlineData: { mimeType: 'image/jpeg', data: image } },
          { text: "Analyze this fashion image. Identify the main item and other detected clothing. Return JSON." }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            mainItem: {
              type: Type.OBJECT,
              properties: {
                category: { type: Type.STRING },
                title: { type: Type.STRING },
                color: { type: Type.STRING },
                material: { type: Type.STRING },
                query: { type: Type.STRING },
              },
              required: ["category", "title", "color", "material", "query"]
            },
            detectedItems: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  category: { type: Type.STRING },
                  title: { type: Type.STRING },
                  color: { type: Type.STRING },
                  material: { type: Type.STRING },
                  query: { type: Type.STRING },
                },
                required: ["category", "title", "color", "material", "query"]
              }
            }
          },
          required: ["mainItem", "detectedItems"]
        }
      }
    });

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: response.text
    };
  } catch (error: any) {
    return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
  }
};
