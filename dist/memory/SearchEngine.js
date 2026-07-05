"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SearchEngine = void 0;
class SearchEngine {
    constructor(llm) {
        this.llm = llm;
        this.index = [];
    }
    async indexNote(id, text, metadata) {
        const vector = await this.llm.generateEmbeddings(text);
        // Evitar duplicados en el índice
        this.index = this.index.filter(e => e.id !== id);
        this.index.push({ id, vector, metadata });
    }
    async search(query, limit = 5) {
        if (this.index.length === 0)
            return [];
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
    cosineSimilarity(v1, v2) {
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
exports.SearchEngine = SearchEngine;
