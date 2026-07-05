import axios from 'axios';
import { BaseLLM } from './BaseLLM';
import { Message, LLMResponse } from '../types';
import { config } from '../config';

export class GeminiProvider extends BaseLLM {
  private apiKey: string;
  private baseUrl = 'https://generativelanguage.googleapis.com/v1/models';

  constructor() {
    super();
    this.apiKey = config.geminiApiKey;
  }

  async generateResponse(messages: Message[], context?: string): Promise<LLMResponse> {
    const url = `${this.baseUrl}/gemini-pro:generateContent?key=${this.apiKey}`;
    
    const systemPrompt = `Eres Brain, un sistema de memoria personal. 
    Tu conocimiento actual basado en memorias pasadas es:
    ${context || 'No hay memorias previas relevantes.'}
    
    Responde al usuario de forma natural, utilizando este contexto si es útil.`;

    // Google Gemini API v1 requiere alternancia estricta User/Model
    // Combinamos el system prompt con el primer mensaje del usuario
    const contents = [];
    
    const history = messages.map(m => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }]
    }));

    // Inyectamos el system prompt en el primer mensaje de usuario
    if (history.length > 0 && history[0].role === 'user') {
      history[0].parts[0].text = `${systemPrompt}\n\n${history[0].parts[0].text}`;
    } else {
      history.unshift({
        role: 'user',
        parts: [{ text: systemPrompt }]
      });
    }

    try {
      const response = await axios.post(url, { contents: history });
      const text = response.data.candidates[0].content.parts[0].text;
      return { content: text };
    } catch (error: any) {
      console.error('Error en Gemini REST API:', error.response?.data || error.message);
      throw error;
    }
  }

  async generateEmbeddings(text: string): Promise<number[]> {
    const url = `${this.baseUrl}/embedding-001:embedContent?key=${this.apiKey}`;
    
    try {
      const response = await axios.post(url, {
        content: { parts: [{ text }] }
      });
      return response.data.embedding.values;
    } catch (error: any) {
      console.error('Error en Gemini Embedding API:', error.response?.data || error.message);
      return new Array(768).fill(0);
    }
  }

  async classifyMemory(content: string): Promise<boolean> {
    const url = `${this.baseUrl}/gemini-pro:generateContent?key=${this.apiKey}`;
    const prompt = `Analiza el siguiente mensaje y decide si contiene información importante que deba guardarse en la memoria a largo plazo (decisiones, ideas, aprendizajes, procesos, etc.). 
    Responde únicamente con la palabra "YES" o "NO".
    
    Mensaje: "${content}"`;

    try {
      const response = await axios.post(url, {
        contents: [{ role: 'user', parts: [{ text: prompt }] }]
      });
      const text = response.data.candidates[0].content.parts[0].text.trim().toUpperCase();
      return text.includes('YES');
    } catch (error: any) {
      console.error('Error en Gemini Classification API:', error.response?.data || error.message);
      return false;
    }
  }
}
