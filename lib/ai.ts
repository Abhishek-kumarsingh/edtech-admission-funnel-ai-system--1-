import { GoogleGenAI, Type } from "@google/genai";

const genAI = new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY || "" });

export interface ExtractedIntent {
  interest: string;
  budget: number;
  timeline: string;
  marks?: number;
}

export const extractIntent = async (message: string): Promise<ExtractedIntent | null> => {
  try {
    const response = await genAI.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Extract student lead information from the following message: "${message}". 
      If information is missing, use default values or null.
      Budget should be a number (e.g., 100000).
      Timeline should be a string (e.g., "Immediate", "3 months").
      Marks should be a number (0-100).`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            interest: { type: Type.STRING },
            budget: { type: Type.NUMBER },
            timeline: { type: Type.STRING },
            marks: { type: Type.NUMBER }
          },
          required: ["interest", "budget", "timeline"]
        }
      }
    });

    const text = response.text;
    if (text) {
      return JSON.parse(text.trim());
    }
    return null;
  } catch (error) {
    console.error("AI Intent Extraction Error:", error);
    return null;
  }
};
