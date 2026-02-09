
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const generateVillaDescription = async (villaData: {
  name: string;
  location: string;
  price_monthly: number;
}): Promise<string> => {
  try {
    const prompt = `Act as a world-class luxury real estate agent. Write a persuasive and elegant marketing description for a villa named "${villaData.name}" located in "${villaData.location}". The monthly rent is $${villaData.price_monthly}. Highlight its potential as a dream home or high-ROI investment. Keep it under 150 words.`;
    
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    return response.text || "No description generated.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Failed to generate description. Please write manually.";
  }
};
