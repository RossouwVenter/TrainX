export interface LLMMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface LLMResponse {
  content: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

export interface LLMProvider {
  chat(
    messages: LLMMessage[],
    options?: { temperature?: number; maxTokens?: number },
  ): Promise<LLMResponse>;
}
