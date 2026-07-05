export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
}

export interface MemoryMetadata {
  title: string;
  created: string;
  updated: string;
  tags: string[];
  aliases: string[];
  summary: string;
}

export interface LongMemoryNote extends MemoryMetadata {
  content: string;
  context: string;
  knowledge: string;
  relatedNotes: string[];
  nextSteps: string[];
}

export interface LLMResponse {
  content: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
  };
}

export interface LLMProvider {
  generateResponse(messages: Message[], context?: string): Promise<LLMResponse>;
  generateEmbeddings(text: string): Promise<number[]>;
  classifyMemory(content: string): Promise<boolean>;
}
