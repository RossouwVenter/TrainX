import { Router } from 'express';
import { z } from 'zod';
import { planWeek } from '../controllers/agent.controller.js';
import { validateRequest } from '../middleware/validateRequest.js';

export const agentRouter = Router();

const planWeekSchema = z.object({
  athleteId: z.string().uuid(),
  coachId: z.string().uuid(),
  weekOf: z.string().min(1),
  instructions: z.string().min(1),
});

agentRouter.post('/plan-week', validateRequest(planWeekSchema), planWeek);
