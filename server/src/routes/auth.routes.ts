import { Router } from 'express';
import { getCoach, getAthletes, signup, login } from '../controllers/auth.controller.js';
import { validateRequest } from '../middleware/validateRequest.js';
import { z } from 'zod';

export const authRouter = Router();

const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  name: z.string().min(1, 'Name is required'),
  role: z.enum(['COACH', 'ATHLETE']),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

authRouter.post('/signup', validateRequest(signupSchema), signup);
authRouter.post('/login', validateRequest(loginSchema), login);
authRouter.get('/coach', getCoach);
authRouter.get('/athletes', getAthletes);
