import { PrismaClient } from '@prisma/client';
import { getWeekStart, getWeekEnd } from '../utils/week.js';

const prisma = new PrismaClient();

export async function getAllAthletesWithStats() {
  const athletes = await prisma.user.findMany({
    where: { role: 'ATHLETE' },
    orderBy: { name: 'asc' },
  });

  const now = new Date();
  const weekStart = getWeekStart(now);
  const weekEnd = getWeekEnd(now);

  const results = await Promise.all(
    athletes.map(async (athlete) => {
      const sessionsThisWeek = await prisma.session.count({
        where: {
          athleteId: athlete.id,
          date: { gte: weekStart, lte: weekEnd },
        },
      });

      const completedThisWeek = await prisma.session.count({
        where: {
          athleteId: athlete.id,
          date: { gte: weekStart, lte: weekEnd },
          status: 'COMPLETED',
        },
      });

      const completionRate = sessionsThisWeek > 0
        ? Math.round((completedThisWeek / sessionsThisWeek) * 100)
        : 0;

      return {
        id: athlete.id,
        name: athlete.name,
        email: athlete.email,
        sessionsThisWeek,
        completionRate,
      };
    }),
  );

  return results;
}

export async function createAthlete(data: { name: string; email: string }) {
  return prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      password: 'password1',
      role: 'ATHLETE',
    },
    select: { id: true, name: true, email: true, role: true },
  });
}

export async function deleteAthlete(id: string) {
  // Delete feedback, sessions, then user
  await prisma.feedback.deleteMany({ where: { athleteId: id } });
  await prisma.session.deleteMany({ where: { athleteId: id } });
  return prisma.user.delete({ where: { id } });
}

export async function getAthleteById(id: string) {
  return prisma.user.findUnique({
    where: { id, role: 'ATHLETE' },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      avatarUrl: true,
      createdAt: true,
    },
  });
}
