"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MemoryEngine = void 0;
class MemoryEngine {
    constructor(shortMemory, longMemory, searchEngine, llm) {
        this.shortMemory = shortMemory;
        this.longMemory = longMemory;
        this.searchEngine = searchEngine;
        this.llm = llm;
    }
    async processMessage(content) {
        // 1. Buscar en memoria semántica
        const relevantNotes = await this.searchEngine.search(content);
        const context = relevantNotes.map(n => n.summary).join('\n');
        // 2. Obtener historial reciente
        const history = await this.shortMemory.getRecentMessages();
        // 3. Generar respuesta con LLM
        const userMsg = {
            id: Date.now().toString(),
            role: 'user',
            content,
            timestamp: Date.now()
        };
        const response = await this.llm.generateResponse([...history, userMsg], context);
        // 4. Guardar en memoria corta
        await this.shortMemory.addMessage(userMsg);
        await this.shortMemory.addMessage({
            id: (Date.now() + 1).toString(),
            role: 'assistant',
            content: response.content,
            timestamp: Date.now()
        });
        // 5. Clasificar para memoria larga
        const shouldStore = await this.llm.classifyMemory(content);
        if (shouldStore) {
            // Lógica para extraer datos y guardar en LongMemory
            console.log('Guardando en memoria larga...');
        }
        return response.content;
    }
}
exports.MemoryEngine = MemoryEngine;
