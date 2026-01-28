
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Generates an AI insight for a given note content and book context.
 * Now handles text-only input to avoid HTML tag confusion.
 */
export async function generateAIInsight(noteContent: string, bookTitle: string): Promise<string | undefined> {
  try {
    // Fix: Using gemini-3-flash-preview for basic text tasks.
    // Fix: Moved persona to systemInstruction for better clarity and performance.
    // Fix: Simplified contents to a plain string.
    // Fix: Removed maxOutputTokens to avoid issues when thinkingBudget is not set.
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `A user is reading "${bookTitle}" and has recorded this insight: "${noteContent}"`,
      config: {
        systemInstruction: "You are a sophisticated literary critic and intellectual mentor. Provide a profound, 2-3 sentence reflection that either expands on the user's idea, connects it to a broader philosophical concept, or poses a challenging follow-up question. Maintain a professional, encouraging, and sophisticated tone. Output only the reflection text without any filler words like 'Here is my thought' or 'As an AI'.",
        temperature: 0.8,
        topP: 0.95,
      }
    });

    // Fix: Directly accessing .text property as it is a getter, not a method.
    return response.text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
}
