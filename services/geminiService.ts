
import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function analyzeFashionImage(base64Data: string): Promise<AnalysisResult> {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: {
      parts: [
        {
          inlineData: {
            mimeType: 'image/jpeg',
            data: base64Data,
          },
        },
        {
          text: `You are a professional fashion buyer. Analyze this image and extract the clothing items.
          
          For the 'query' field, generate a search term that is likely to find results in a retail database. 
          IMPORTANT: Use 2-3 keywords maximum. 
          Example: Instead of "Vintage distressed high-waisted blue boyfriend jeans", use "Blue straight jeans".
          
          This helps find results even if the user is only joined to a few brands on Awin.`
        }
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

  const rawJson = JSON.parse(response.text || '{}');
  
  const result: AnalysisResult = {
    mainItem: { ...rawJson.mainItem, id: 'main' },
    detectedItems: (rawJson.detectedItems || []).map((item: any, idx: number) => ({
      ...item,
      id: `det-${idx}`
    }))
  };

  return result;
}
