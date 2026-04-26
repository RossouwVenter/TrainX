import { Router } from 'express';
import { z } from 'zod';
import { getAthletes, getAthlete, createAthlete, deleteAthlete } from '../controllers/athlete.controller.js';
import { validateRequest } from '../middleware/validateRequest.js';

export const athleteRouter = Router();

const createAthleteSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Valid email is required'),
});

athleteRouter.get('/', getAthletes);
athleteRouter.post('/', validateRequest(createAthleteSchema), createAthlete);
athleteRouter.get('/:id', getAthlete);
athleteRouter.delete('/:id', deleteAthlete);
