import { GoogleGenAI } from "@google/genai";

// 这里的 API_KEY 会由 Vite 在构建时通过 process.env.API_KEY 注入
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * 为给定的笔记内容和书籍背景生成 AI 洞察。
 */
export async function generateAIInsight(noteContent: string, bookTitle: string): Promise<string | undefined> {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [{
        parts: [{
          text: `你是一位资深的读书博主和思想导师。用户正在阅读《${bookTitle}》，并写下了如下笔记：
          
          "${noteContent}"
          
          请针对这段笔记提供 2-3 句简洁的深度洞察、一个能引发思考的问题，或是一个相关的知识概念，帮助用户深化对这本书的理解。保持语气专业且具有启发性。请直接输出内容，不要包含“好的”、“这是我的建议”等废话。`
        }]
      }],
      config: {
        temperature: 0.7,
        topP: 0.9,
        maxOutputTokens: 300,
      }
    });

    return response.text;
  } catch (error) {
    console.error("Gemini API 错误:", error);
    throw error;
  }
}