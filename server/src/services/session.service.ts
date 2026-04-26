import { PrismaClient, Discipline, SessionStatus } from '@prisma/client';
import { getWeekStart, getWeekEnd } from '../utils/week.js';

const prisma = new PrismaClient();

const DAY_NAMES = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

interface WeekSchedule {
  weekStart: string;
  weekEnd: string;
  days: { date: string; dayName: string; sessions: unknown[] }[];
  totals: Record<string, { count: number; totalMinutes: number }>;
}

export async function getWeekSchedule(athleteId: string, weekOf?: string): Promise<WeekSchedule> {
  const referenceDate = weekOf ? new Date(weekOf) : new Date();
  const weekStart = getWeekStart(referenceDate);
  const weekEnd = getWeekEnd(referenceDate);

  const sessions = await prisma.session.findMany({
    where: {
      athleteId,
      date: { gte: weekStart, lte: weekEnd },
    },
    include: { feedback: true },
    orderBy: [{ date: 'asc' }, { order: 'asc' }],
  });

  // Group sessions by day (Mon-Sun)
  const days: { date: string; dayName: string; sessions: typeof sessions }[] = [];
  for (let i = 0; i < 7; i++) {
    const dayDate = new Date(weekStart);
    dayDate.setDate(weekStart.getDate() + i);
    const dateStr = dayDate.toISOString().split('T')[0];

    days.push({
      date: dateStr,
      dayName: DAY_NAMES[i],
      sessions: sessions.filter((s) => s.date.toISOString().split('T')[0] === dateStr),
    });
  }

  // Compute discipline totals
  const totals: Record<string, { count: number; totalMinutes: number }> = {};
  for (const session of sessions) {
    const disc = session.discipline;
    if (!totals[disc]) {
      totals[disc] = { count: 0, totalMinutes: 0 };
    }
    totals[disc].count += 1;
    totals[disc].totalMinutes += session.duration;
  }

  return {
    weekStart: weekStart.toISOString().split('T')[0],
    weekEnd: weekEnd.toISOString().split('T')[0],
    days,
    totals,
  };
}

interface CreateSessionInput {
  title: string;
  description?: string;
  discipline: Discipline;
  date: string;
  duration: number;
  athleteId: string;
  coachId: string;
  order?: number;
}

export async function createSession(data: CreateSessionInput) {
  return prisma.session.create({
    data: {
      title: data.title,
      description: data.description,
      discipline: data.discipline,
      date: new Date(data.date),
      duration: data.duration,
      athleteId: data.athleteId,
      coachId: data.coachId,
      order: data.order ?? 0,
    },
    include: { feedback: true },
  });
}

interface UpdateSessionInput {
  title?: string;
  description?: string;
  discipline?: Discipline;
  date?: string;
  duration?: number;
  order?: number;
}

export async function updateSession(id: string, data: UpdateSessionInput) {
  return prisma.session.update({
    where: { id },
    data: {
      ...(data.title !== undefined && { title: data.title }),
      ...(data.description !== undefined && { description: data.description }),
      ...(data.discipline !== undefined && { discipline: data.discipline }),
      ...(data.date !== undefined && { date: new Date(data.date) }),
      ...(data.duration !== undefined && { duration: data.duration }),
      ...(data.order !== undefined && { order: data.order }),
    },
    include: { feedback: true },
  });
}

export async function getSessionById(id: string) {
  return prisma.session.findUnique({
    where: { id },
    include: { feedback: true },
  });
}

export async function deleteSession(id: string) {
  return prisma.session.delete({ where: { id } });
}

export async function updateSessionStatus(id: string, status: SessionStatus) {
  return prisma.session.update({
    where: { id },
    data: { status },
    include: { feedback: true },
  });
}
