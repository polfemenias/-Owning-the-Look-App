
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
          text: "You are a professional fashion curator. Analyze this image and identify all distinct clothing items and accessories. Return a structured JSON object with a 'mainItem' and a list of 'detectedItems'. For each item, provide a category, title, color, material, and a concise search query."
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
  
  // Post-process to add IDs
  const result: AnalysisResult = {
    mainItem: { ...rawJson.mainItem, id: 'main' },
    detectedItems: rawJson.detectedItems.map((item: any, idx: number) => ({
      ...item,
      id: `det-${idx}`
    }))
  };

  return result;
}
