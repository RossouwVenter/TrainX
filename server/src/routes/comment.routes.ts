import { Router } from 'express';
import { z } from 'zod';
import { getComments, addComment, removeComment } from '../controllers/comment.controller.js';
import { validateRequest } from '../middleware/validateRequest.js';

export const commentRouter = Router();

const createCommentSchema = z.object({
  sessionId: z.string().uuid(),
  authorId: z.string().uuid(),
  text: z.string().min(1, 'Comment text is required'),
});

commentRouter.get('/:sessionId', getComments);
commentRouter.post('/', validateRequest(createCommentSchema), addComment);
commentRouter.delete('/:id', removeComment);
