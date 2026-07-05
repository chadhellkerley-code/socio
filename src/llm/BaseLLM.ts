import { LLMProvider, Message, LLMResponse } from '../types';

export abstract class BaseLLM implements LLMProvider {
  abstract generateResponse(messages: Message[], context?: string): Promise<LLMResponse>;
  abstract generateEmbeddings(text: string): Promise<number[]>;
  abstract classifyMemory(content: string): Promise<boolean>;
}
