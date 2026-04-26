import { Router } from 'express';
import { z } from 'zod';
import {
  getWeekSchedule,
  getSessionById,
  createSession,
  updateSession,
  deleteSession,
  updateSessionStatus,
} from '../controllers/session.controller.js';
import { validateRequest } from '../middleware/validateRequest.js';

export const sessionRouter = Router();

const createSessionSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  discipline: z.enum(['SWIM', 'BIKE', 'RUN', 'STRENGTH', 'FLEXIBILITY', 'REST', 'OTHER']),
  date: z.string().min(1),
  duration: z.number().int().min(0),
  athleteId: z.string().uuid(),
  coachId: z.string().uuid(),
  order: z.number().int().optional(),
});

const updateSessionSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().optional(),
  discipline: z.enum(['SWIM', 'BIKE', 'RUN', 'STRENGTH', 'FLEXIBILITY', 'REST', 'OTHER']).optional(),
  date: z.string().optional(),
  duration: z.number().int().min(0).optional(),
  order: z.number().int().optional(),
});

const updateStatusSchema = z.object({
  status: z.enum(['PLANNED', 'COMPLETED', 'SKIPPED', 'MODIFIED']),
});

sessionRouter.get('/', getWeekSchedule);
sessionRouter.get('/:id', getSessionById);
sessionRouter.post('/', validateRequest(createSessionSchema), createSession);
sessionRouter.put('/:id', validateRequest(updateSessionSchema), updateSession);
sessionRouter.delete('/:id', deleteSession);
sessionRouter.put('/:id/status', validateRequest(updateStatusSchema), updateSessionStatus);
