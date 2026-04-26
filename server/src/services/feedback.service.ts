import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface CreateFeedbackInput {
  sessionId: string;
  athleteId: string;
  rpe: number;
  notes?: string;
  completed: boolean;
}

export async function createFeedback(data: CreateFeedbackInput) {
  const feedback = await prisma.feedback.create({
    data: {
      sessionId: data.sessionId,
      athleteId: data.athleteId,
      rpe: data.rpe,
      notes: data.notes,
      completed: data.completed,
    },
  });

  // Update session status based on feedback
  await prisma.session.update({
    where: { id: data.sessionId },
    data: {
      status: data.completed ? 'COMPLETED' : 'SKIPPED',
    },
  });

  return feedback;
}

export async function getFeedbackBySessionId(sessionId: string) {
  return prisma.feedback.findUnique({ where: { sessionId } });
}
