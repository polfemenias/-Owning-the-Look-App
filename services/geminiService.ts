
import { AnalysisResult } from "../types";

export async function analyzeFashionImage(base64Data: string): Promise<AnalysisResult> {
  const response = await fetch('/.netlify/functions/analyze', {
    method: 'POST',
    body: JSON.stringify({ image: base64Data }),
    headers: { 'Content-Type': 'application/json' }
  });

  if (!response.ok) {
    throw new Error('Failed to analyze image via serverless function');
  }

  const rawJson = await response.json();
  
  const result: AnalysisResult = {
    mainItem: { ...rawJson.mainItem, id: 'main' },
    detectedItems: (rawJson.detectedItems || []).map((item: any, idx: number) => ({
      ...item,
      id: `det-${idx}`
    }))
  };

  return result;
}
