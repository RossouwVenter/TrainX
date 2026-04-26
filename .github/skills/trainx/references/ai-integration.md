# AI Integration

## Swappable LLM Provider Layer

Located in `server/src/services/llm/`. Factory pattern allows swapping between OpenAI, Anthropic, or other providers.

### Types (`types.ts`)

```typescript
export interface LLMMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface LLMResponse {
  content: string;
  usage?: { promptTokens: number; completionTokens: number; totalTokens: number };
}

export interface LLMProvider {
  chat(messages: LLMMessage[], options?: { temperature?: number; maxTokens?: number }): Promise<LLMResponse>;
}
```

### OpenAI Provider (`openai.ts`)

```typescript
import OpenAI from 'openai';
import { LLMProvider, LLMMessage, LLMResponse } from './types';

export class OpenAIProvider implements LLMProvider {
  private client: OpenAI;
  private model: string;

  constructor(apiKey: string, model = 'gpt-4o') {
    this.client = new OpenAI({ apiKey });
    this.model = model;
  }

  async chat(messages: LLMMessage[], options?: { temperature?: number; maxTokens?: number }): Promise<LLMResponse> {
    const response = await this.client.chat.completions.create({
      model: this.model,
      messages,
      temperature: options?.temperature ?? 0.7,
      max_tokens: options?.maxTokens ?? 2000,
    });

    return {
      content: response.choices[0]?.message?.content || '',
      usage: response.usage ? {
        promptTokens: response.usage.prompt_tokens,
        completionTokens: response.usage.completion_tokens,
        totalTokens: response.usage.total_tokens,
      } : undefined,
    };
  }
}
```

### Factory (`index.ts`)

```typescript
import { LLMProvider } from './types';
import { OpenAIProvider } from './openai';

export function createLLMProvider(): LLMProvider {
  const provider = process.env.LLM_PROVIDER || 'openai';
  switch (provider) {
    case 'openai':
      return new OpenAIProvider(process.env.OPENAI_API_KEY!);
    default:
      throw new Error(`Unknown LLM provider: ${provider}`);
  }
}

export * from './types';
```

## Agent Service

The agent service uses the LLM provider to generate structured training plans.

### System Prompt

```
You are an expert triathlon and fitness coach AI assistant. 
Generate a week of training sessions based on the coach's instructions.
Return ONLY valid JSON array of sessions with these fields:
- title (string)
- discipline (one of: SWIM, BIKE, RUN, STRENGTH, FLEXIBILITY, REST, OTHER)
- date (ISO date string, within the specified week)
- duration (number, in minutes)
- description (string, detailed workout instructions)
```

### API Endpoint

`POST /api/v1/agent/plan-week` accepts `{ athleteId, coachId, weekOf, instructions }` and returns `{ sessions: [...] }`.

## Environment Variables

```env
OPENAI_API_KEY=sk-...
LLM_PROVIDER=openai       # optional, defaults to openai
LLM_MODEL=gpt-4o          # optional, defaults to gpt-4o
```

## Mobile UI

The AI planner is accessed via a floating action button (CPU icon) on the coach's athlete schedule view. It opens a modal where the coach types natural language instructions and the AI generates sessions for the selected week.
