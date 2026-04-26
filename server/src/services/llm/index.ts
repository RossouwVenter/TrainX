import { LLMProvider } from './types.js';
import { OpenAIProvider } from './openai.js';

export function createLLMProvider(): LLMProvider {
  const provider = process.env.LLM_PROVIDER || 'openai';
  const model = process.env.LLM_MODEL || 'gpt-4o';

  switch (provider) {
    case 'openai':
      return new OpenAIProvider(process.env.OPENAI_API_KEY!, model);
    default:
      throw new Error(`Unknown LLM provider: ${provider}`);
  }
}

export * from './types.js';
