import { GoogleGenAI } from "@google/genai";
import { SYSTEM_PROMPT } from "../constants";

let aiClient: GoogleGenAI | null = null;

const getClient = () => {
  if (!aiClient) {
    aiClient = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }
  return aiClient;
};

export const generateAssistantResponse = async (userMessage: string): Promise<string> => {
  try {
    const client = getClient();
    const model = 'gemini-3-flash-preview';
    
    const response = await client.models.generateContent({
      model: model,
      contents: userMessage,
      config: {
        systemInstruction: SYSTEM_PROMPT,
      }
    });

    return response.text || "I'm having a bit of trouble connecting to the academic server right now. Please try again.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Sorry, I couldn't process that request. Please check your connection.";
  }
};