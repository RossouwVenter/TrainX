import { Router } from 'express';
import { z } from 'zod';
import { submitFeedback, getFeedback } from '../controllers/feedback.controller.js';
import { validateRequest } from '../middleware/validateRequest.js';

export const feedbackRouter = Router();

const feedbackSchema = z.object({
  sessionId: z.string().uuid(),
  athleteId: z.string().uuid(),
  rpe: z.number().int().min(1).max(10),
  notes: z.string().optional(),
  completed: z.boolean(),
});

feedbackRouter.post('/', validateRequest(feedbackSchema), submitFeedback);
feedbackRouter.get('/:sessionId', getFeedback);
