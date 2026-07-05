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
    // Evitar duplicados en el índice
    this.index = this.index.filter(e => e.id !== id);
    this.index.push({ id, vector, metadata });
  }

  async search(query: string, limit: number = 5): Promise<any[]> {
    if (this.index.length === 0) return [];

    const queryVector = await this.llm.generateEmbeddings(query);
    
    const results = this.index
      .map(entry => ({
        ...entry,
        score: this.cosineSimilarity(queryVector, entry.vector)
      }))
      .sort((a, b) => b.score - a.score)
      .filter(r => r.score > 0.7) // Umbral de relevancia
      .slice(0, limit);

    return results.map(r => r.metadata);
  }

  private cosineSimilarity(v1: number[], v2: number[]): number {
    let dotProduct = 0;
    let normA = 0;
    let normB = 0;
    for (let i = 0; i < v1.length; i++) {
      dotProduct += v1[i] * v2[i];
      normA += v1[i] * v1[i];
      normB += v2[i] * v2[i];
    }
    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
  }
}
