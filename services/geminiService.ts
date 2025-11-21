import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";

const API_KEY = process.env.API_KEY || '';

let aiClient: GoogleGenAI | null = null;

export const getAiClient = (): GoogleGenAI => {
  if (!aiClient) {
    aiClient = new GoogleGenAI({ apiKey: API_KEY });
  }
  return aiClient;
};

export const createChatSession = (systemInstruction?: string): Chat => {
  const ai = getAiClient();
  return ai.chats.create({
    model: 'gemini-2.5-flash',
    config: {
      systemInstruction: systemInstruction || 'You are a specialized placement preparation assistant for BITS Pilani MBA students. You focus on Analytics, Finance, and Consulting interview prep. Be professional, encouraging, and concise.',
    },
  });
};

export const sendMessageStream = async (chat: Chat, message: string) => {
  return chat.sendMessageStream({ message });
};

export const generateFeedback = async (question: string, answer: string) => {
  const ai = getAiClient();
  const prompt = `
    Question: "${question}"
    Candidate Answer: "${answer}"
    
    Please provide a critique of this answer. 
    1. Rating (1-10)
    2. What was good
    3. What to improve
    4. An ideal sample answer (concise)
  `;
  
  const response: GenerateContentResponse = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
  });
  
  return response.text;
};
