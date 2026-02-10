
import { GoogleGenAI } from "@google/genai";

// Generate content using Gemini 3 Flash model
export const generateVillaDescription = async (villaData: {
  name: string;
  location: string;
  price_monthly: number;
}): Promise<string> => {
  try {
    // Always use the API key directly from process.env.API_KEY
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const prompt = `Act as a world-class luxury real estate agent. Write a persuasive marketing description for a villa named "${villaData.name}" in "${villaData.location}". Price is $${villaData.price_monthly}/month. Max 100 words.`;
    
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    // Extract text directly from the response property
    return response.text || "No description generated.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Gagal membuat deskripsi otomatis.";
  }
};
