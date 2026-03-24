import { GoogleGenAI } from "@google/genai";

export const getGeminiResponse = async (prompt: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  const model = "gemini-3-flash-preview";

  const systemInstruction = `
    You are a helpful and professional Health Assistant for E-pharmacy website, an online pharmacy.
    Your goal is to provide general health information and suggest over-the-counter (OTC) products from our categories: Pain Relief, Vitamins, First Aid, Personal Care, Baby Care, Cold & Flu, Digestive Health.
    
    CRITICAL RULES:
    1. ALWAYS include a medical disclaimer: "I am an AI assistant, not a doctor. Please consult a healthcare professional for medical advice."
    2. NEVER diagnose specific conditions or prescribe medications.
    3. If a user describes severe symptoms (chest pain, difficulty breathing, severe bleeding), urge them to seek emergency medical help immediately.
    4. Keep responses concise and empathetic.
    5. If suggesting a product, mention that it's available in our shop.
  `;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: [{ parts: [{ text: prompt }] }],
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    return response.text || "I'm sorry, I couldn't process that request.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "I'm having trouble connecting to my health database right now. Please try again later.";
  }
};
