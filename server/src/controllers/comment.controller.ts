import { Request, Response, NextFunction } from 'express';
import * as commentService from '../services/comment.service.js';

export async function getComments(req: Request, res: Response, next: NextFunction) {
  try {
    const comments = await commentService.getCommentsBySessionId(req.params.sessionId);
    res.json(comments);
  } catch (err) {
    next(err);
  }
}

export async function addComment(req: Request, res: Response, next: NextFunction) {
  try {
    const comment = await commentService.createComment(req.body);
    res.status(201).json(comment);
  } catch (err) {
    next(err);
  }
}

export async function removeComment(req: Request, res: Response, next: NextFunction) {
  try {
    await commentService.deleteComment(req.params.id);
    res.status(204).send();
  } catch (err: any) {
    if (err?.code === 'P2025') {
      const error = new Error('Comment not found') as Error & { statusCode: number };
      error.statusCode = 404;
      return next(error);
    }
    next(err);
  }
}
