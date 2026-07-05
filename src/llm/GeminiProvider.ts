import { GoogleGenerativeAI } from '@google/generative-ai';
import { BaseLLM } from './BaseLLM';
import { Message, LLMResponse } from '../types';
import { config } from '../config';

export class GeminiProvider extends BaseLLM {
  private genAI: GoogleGenerativeAI;

  constructor() {
    super();
    this.genAI = new GoogleGenerativeAI(config.geminiApiKey);
  }

  async generateResponse(messages: Message[], context?: string): Promise<LLMResponse> {
    const model = this.genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });
    
    const systemPrompt = `Eres Brain, un sistema de memoria personal. 
    Tu conocimiento actual basado en memorias pasadas es:
    ${context || 'No hay memorias previas relevantes.'}
    
    Responde al usuario de forma natural, utilizando este contexto si es útil.`;

    const chat = model.startChat({
      history: messages.slice(0, -1).map(m => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }],
      })),
      generationConfig: {
        maxOutputTokens: 1000,
      },
    });

    const lastMessage = messages[messages.length - 1].content;
    const fullPrompt = `${systemPrompt}\n\nUsuario: ${lastMessage}`;
    
    const result = await chat.sendMessage(fullPrompt);
    const response = await result.response;
    return { content: response.text() };
  }

  async generateEmbeddings(text: string): Promise<number[]> {
    const model = this.genAI.getGenerativeModel({ model: "text-embedding-004" });
    const result = await model.embedContent(text);
    return result.embedding.values;
  }

  async classifyMemory(content: string): Promise<boolean> {
    const model = this.genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });
    const prompt = `Analiza el siguiente mensaje y decide si contiene información importante que deba guardarse en la memoria a largo plazo (decisiones, ideas, aprendizajes, procesos, etc.). 
    Responde únicamente con la palabra "YES" o "NO".
    
    Mensaje: "${content}"`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text().trim().toUpperCase();
    return text.includes('YES');
  }
}
