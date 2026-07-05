"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GeminiProvider = void 0;
const generative_ai_1 = require("@google/generative-ai");
const BaseLLM_1 = require("./BaseLLM");
const config_1 = require("../config");
class GeminiProvider extends BaseLLM_1.BaseLLM {
    constructor() {
        super();
        this.genAI = new generative_ai_1.GoogleGenerativeAI(config_1.config.geminiApiKey);
    }
    async generateResponse(messages, context) {
        const model = this.genAI.getGenerativeModel({ model: "gemini-pro" });
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
    async generateEmbeddings(text) {
        const model = this.genAI.getGenerativeModel({ model: "embedding-001" });
        const result = await model.embedContent(text);
        return result.embedding.values;
    }
    async classifyMemory(content) {
        const model = this.genAI.getGenerativeModel({ model: "gemini-pro" });
        const prompt = `Analiza el siguiente mensaje y decide si contiene información importante que deba guardarse en la memoria a largo plazo (decisiones, ideas, aprendizajes, procesos, etc.). 
    Responde únicamente con la palabra "YES" o "NO".
    
    Mensaje: "${content}"`;
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text().trim().toUpperCase();
        return text.includes('YES');
    }
}
exports.GeminiProvider = GeminiProvider;
