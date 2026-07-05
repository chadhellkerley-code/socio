import axios from 'axios';
import { BaseLLM } from './BaseLLM';
import { Message, LLMResponse } from '../types';
import { config } from '../config';

export class GeminiProvider extends BaseLLM {
  private apiKey: string;
  private baseUrl = 'https://generativelanguage.googleapis.com/v1beta/models';

  constructor() {
    super();
    this.apiKey = config.geminiApiKey;
  }

  async generateResponse(messages: Message[], context?: string): Promise<LLMResponse> {
    const url = `${this.baseUrl}/gemini-1.5-flash:generateContent?key=${this.apiKey}`;
    
    const lastMessage = messages[messages.length - 1].content;
    const systemPrompt = `Eres Brain, un sistema de memoria personal. 
    Tu conocimiento actual basado en memorias pasadas es:
    ${context || 'No hay memorias previas relevantes.'}
    
    Responde al usuario de forma natural, utilizando este contexto si es útil.`;

    // Estructura simplificada al máximo: un solo mensaje de usuario con todo el contexto
    const payload = {
      contents: [{
        parts: [{
          text: `${systemPrompt}\n\nPregunta del usuario: ${lastMessage}`
        }]
      }]
    };

    try {
      const response = await axios.post(url, payload);
      if (response.data.candidates && response.data.candidates[0].content) {
        return { content: response.data.candidates[0].content.parts[0].text };
      } else {
        console.error('Respuesta inesperada de Gemini:', JSON.stringify(response.data));
        throw new Error('Respuesta de Gemini malformada');
      }
    } catch (error: any) {
      const errorMsg = error.response?.data?.error?.message || error.message;
      console.error('Error en Gemini REST API:', errorMsg);
      throw new Error(`Gemini Error: ${errorMsg}`);
    }
  }

  async generateEmbeddings(text: string): Promise<number[]> {
    const url = `${this.baseUrl}/text-embedding-004:embedContent?key=${this.apiKey}`;
    
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
    const url = `${this.baseUrl}/gemini-1.5-flash:generateContent?key=${this.apiKey}`;
    const prompt = `Analiza el siguiente mensaje y decide si contiene información importante que deba guardarse en la memoria a largo plazo (decisiones, ideas, aprendizajes, procesos, etc.). 
    Responde únicamente con la palabra "YES" o "NO".
    
    Mensaje: "${content}"`;

    try {
      const response = await axios.post(url, {
        contents: [{ parts: [{ text: prompt }] }]
      });
      const text = response.data.candidates[0].content.parts[0].text.trim().toUpperCase();
      return text.includes('YES');
    } catch (error: any) {
      console.error('Error en Gemini Classification API:', error.response?.data || error.message);
      return false;
    }
  }
}
