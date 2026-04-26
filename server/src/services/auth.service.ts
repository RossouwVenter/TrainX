import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function findCoach() {
  return prisma.user.findFirst({ where: { role: 'COACH' } });
}

export async function findAllAthletes() {
  return prisma.user.findMany({ where: { role: 'ATHLETE' }, orderBy: { name: 'asc' } });
}
