
import { GoogleGenAI } from "@google/genai";

const getApiKey = () => {
  try {
    // Cek di process.env (Vercel) atau global window
    return process.env.API_KEY || (window as any).process?.env?.API_KEY || '';
  } catch (e) {
    return '';
  }
};

export const generateVillaDescription = async (villaData: {
  name: string;
  location: string;
  price_monthly: number;
}): Promise<string> => {
  const apiKey = getApiKey();
  
  if (!apiKey) {
    console.warn("API Key Gemini tidak ditemukan.");
    return "Deskripsi otomatis tidak tersedia (API Key belum diatur).";
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const prompt = `Act as a world-class luxury real estate agent. Write a persuasive marketing description for a villa named "${villaData.name}" in "${villaData.location}". Price is $${villaData.price_monthly}/month. Max 100 words.`;
    
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    return response.text || "No description generated.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Gagal membuat deskripsi otomatis.";
  }
};
