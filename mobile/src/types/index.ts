export type Role = 'COACH' | 'ATHLETE';

export type Discipline = 'SWIM' | 'BIKE' | 'RUN' | 'STRENGTH' | 'FLEXIBILITY' | 'REST' | 'OTHER';

export type SessionStatus = 'PLANNED' | 'COMPLETED' | 'SKIPPED' | 'MODIFIED';

export interface User {
  id: string;
  email: string;
  name: string;
  role: Role;
  avatarUrl?: string;
}

export interface Session {
  id: string;
  title: string;
  description?: string;
  discipline: Discipline;
  date: string;
  duration: number;
  status: SessionStatus;
  order: number;
  coachId: string;
  athleteId: string;
  feedback?: Feedback;
}

export interface Feedback {
  id: string;
  rpe: number;
  notes?: string;
  completed: boolean;
  sessionId: string;
  athleteId: string;
}

export interface WeekSchedule {
  weekStart: string;
  weekEnd: string;
  days: DaySchedule[];
  totals: DisciplineTotals;
}

export interface DaySchedule {
  date: string;
  dayName: string;
  sessions: Session[];
}

export interface DisciplineTotals {
  [discipline: string]: { count: number; totalMinutes: number };
}

export interface AthleteWithStats {
  id: string;
  name: string;
  email: string;
  sessionsThisWeek: number;
  completionRate: number;
}

export interface AIPlanRequest {
  athleteId: string;
  coachId: string;
  weekOf: string;
  instructions: string;
}

export interface AIPlanResponse {
  sessions: Array<{
    title: string;
    discipline: Discipline;
    date: string;
    duration: number;
    description?: string;
  }>;
}

export interface Comment {
  id: string;
  text: string;
  sessionId: string;
  authorId: string;
  author: { id: string; name: string; role: Role };
  createdAt: string;
}
