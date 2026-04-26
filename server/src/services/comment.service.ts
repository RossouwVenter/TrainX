import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function getCommentsBySessionId(sessionId: string) {
  return prisma.comment.findMany({
    where: { sessionId },
    include: {
      author: {
        select: { id: true, name: true, role: true },
      },
    },
    orderBy: { createdAt: 'asc' },
  });
}

export async function createComment(data: { sessionId: string; authorId: string; text: string }) {
  return prisma.comment.create({
    data: {
      sessionId: data.sessionId,
      authorId: data.authorId,
      text: data.text,
    },
    include: {
      author: {
        select: { id: true, name: true, role: true },
      },
    },
  });
}

export async function deleteComment(id: string) {
  return prisma.comment.delete({ where: { id } });
}
