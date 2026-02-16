import { GoogleGenAI, Type } from "@google/genai";
import { GeminiIdeaResponse } from '../types';

// Initialize Gemini Client
const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const generateTattooConcepts = async (
  userDescription: string,
  stylePreference: string
): Promise<GeminiIdeaResponse | null> => {
  if (!apiKey) {
    console.warn("Gemini API Key is missing. Please set process.env.API_KEY.");
    return null;
  }

  try {
    const prompt = `
      You are an expert tattoo artist consultant. 
      A client wants a tattoo with the following description: "${userDescription}".
      Preferred Style: "${stylePreference}".
      
      Please generate 3 distinct, creative tattoo concepts based on this input.
      For each concept, provide a title, a detailed visual description, a suggested body placement for best flow, and estimated time to tattoo.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            concepts: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  description: { type: Type.STRING },
                  placementSuggestion: { type: Type.STRING },
                  estimatedTime: { type: Type.STRING },
                },
                required: ["title", "description", "placementSuggestion", "estimatedTime"]
              }
            }
          }
        }
      }
    });

    const jsonText = response.text;
    if (!jsonText) return null;
    
    return JSON.parse(jsonText) as GeminiIdeaResponse;

  } catch (error) {
    console.error("Error generating tattoo concepts:", error);
    return null;
  }
};
