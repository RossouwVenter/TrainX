import { Router } from 'express';
import { getCoach, getAthletes } from '../controllers/auth.controller.js';

export const authRouter = Router();

authRouter.get('/coach', getCoach);
authRouter.get('/athletes', getAthletes);
