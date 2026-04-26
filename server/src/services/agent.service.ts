import { createLLMProvider } from './llm/index.js';
import { getWeekStart, getWeekEnd } from '../utils/week.js';

const SYSTEM_PROMPT = `You are an expert triathlon and fitness coach AI assistant.
Generate a week of training sessions based on the coach's instructions.
Return ONLY valid JSON array of sessions with these fields:
- title (string)
- discipline (one of: SWIM, BIKE, RUN, STRENGTH, FLEXIBILITY, REST, OTHER)
- date (ISO date string, within the specified week)
- duration (number, in minutes)
- description (string, detailed workout instructions)

Do not include any markdown formatting, code fences, or explanation. Return ONLY the JSON array.`;

interface PlanWeekInput {
  athleteId: string;
  coachId: string;
  weekOf: string;
  instructions: string;
}

interface PlannedSession {
  title: string;
  discipline: string;
  date: string;
  duration: number;
  description: string;
}

export async function planWeek(input: PlanWeekInput): Promise<PlannedSession[]> {
  const llm = createLLMProvider();
  const weekStart = getWeekStart(new Date(input.weekOf));
  const weekEnd = getWeekEnd(new Date(input.weekOf));

  const userMessage = `Plan a training week from ${weekStart.toISOString().split('T')[0]} (Monday) to ${weekEnd.toISOString().split('T')[0]} (Sunday).

Coach instructions: ${input.instructions}

Generate sessions for each day of the week as appropriate.`;

  const response = await llm.chat([
    { role: 'system', content: SYSTEM_PROMPT },
    { role: 'user', content: userMessage },
  ], { temperature: 0.7, maxTokens: 2000 });

  // Parse the JSON response
  let sessions: PlannedSession[];
  try {
    // Strip potential markdown code fences
    const cleaned = response.content.replace(/```json?\n?/g, '').replace(/```\n?/g, '').trim();
    sessions = JSON.parse(cleaned);
  } catch {
    throw new Error('Failed to parse AI response as valid JSON');
  }

  if (!Array.isArray(sessions)) {
    throw new Error('AI response is not an array of sessions');
  }

  return sessions;
}
