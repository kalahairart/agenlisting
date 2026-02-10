
import { GoogleGenAI } from "@google/genai";

export const generateVillaDescription = async (villaData: {
  name: string;
  location: string;
  price_monthly: number;
}): Promise<string> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Act as a luxury real estate agent. Write a short persuasive marketing description for a villa named "${villaData.name}" in "${villaData.location}". Price is $${villaData.price_monthly}/month. Max 60 words.`,
    });

    return response.text || "No description generated.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Gagal membuat deskripsi otomatis.";
  }
};
