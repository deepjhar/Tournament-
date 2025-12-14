import { GoogleGenAI } from "@google/genai";
import { GameType } from "../types";

let aiClient: GoogleGenAI | null = null;

const getClient = () => {
  if (aiClient) return aiClient;

  // The API key is injected by Vite's define plugin during build
  const apiKey = process.env.API_KEY;

  if (!apiKey) {
    console.warn("Gemini API Key missing. AI features will be disabled.");
    return null;
  }

  try {
    aiClient = new GoogleGenAI({ apiKey });
    return aiClient;
  } catch (error) {
    console.error("Error initializing Gemini client:", error);
    return null;
  }
};

export const generateTournamentStrategy = async (game: GameType, map: string, mode: string): Promise<string> => {
  const client = getClient();
  if (!client) return "AI Strategy unavailable (No API Key).";

  try {
    const prompt = `Provide 3 short, pro-level strategic tips for winning a ${game} tournament match on the map ${map} in ${mode} mode. Format as a simple bulleted list. Keep it under 100 words total.`;
    
    const response = await client.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    
    return response.text || "Stay low, move fast, and aim true.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Focus on positioning and zone management. (AI Offline)";
  }
};

export const chatWithAiRef = async (message: string, context: string): Promise<string> => {
  const client = getClient();
  if (!client) return "I am currently offline. Please try again later.";

  try {
    const response = await client.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `System: You are an AI Esports Referee and Coach named "BattleBot". 
      Context: ${context}
      User Question: ${message}
      Answer briefly and helpfully. If asked about rules, be strict. If asked about strategy, be encouraging.`,
    });
    return response.text || "I didn't catch that. Could you rephrase?";
  } catch (error) {
    console.error("Gemini Chat Error:", error);
    return "Connection error. Please try again.";
  }
};