import { ShortMemory } from './ShortMemory';
import { LongMemory } from './LongMemory';
import { SearchEngine } from './SearchEngine';
import { BaseLLM } from '../llm/BaseLLM';
import { Message } from '../types';

export class MemoryEngine {
  constructor(
    private shortMemory: ShortMemory,
    private longMemory: LongMemory,
    private searchEngine: SearchEngine,
    private llm: BaseLLM
  ) {}

  async processMessage(content: string): Promise<string> {
    // 1. Buscar en memoria semántica
    const relevantNotes = await this.searchEngine.search(content);
    const context = relevantNotes.map(n => n.summary).join('\n');

    // 2. Obtener historial reciente
    const history = await this.shortMemory.getRecentMessages();

    // 3. Generar respuesta con LLM
    const userMsg: Message = {
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
