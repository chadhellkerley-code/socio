import { BaseLLM } from '../llm/BaseLLM';

export interface VectorEntry {
  id: string;
  vector: number[];
  metadata: any;
}

export class SearchEngine {
  private index: VectorEntry[] = [];

  constructor(private llm: BaseLLM) {}

  async indexNote(id: string, text: string, metadata: any) {
    const vector = await this.llm.generateEmbeddings(text);
    this.index.push({ id, vector, metadata });
  }

  async search(query: string, limit: number = 5): Promise<any[]> {
    const queryVector = await this.llm.generateEmbeddings(query);
    
    // Simulación de búsqueda por similitud de coseno
    const results = this.index
      .map(entry => ({
        ...entry,
        score: this.cosineSimilarity(queryVector, entry.vector)
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);

    return results.map(r => r.metadata);
  }

  private cosineSimilarity(v1: number[], v2: number[]): number {
    // Implementación simplificada de similitud
    return Math.random(); // Placeholder
  }
}
