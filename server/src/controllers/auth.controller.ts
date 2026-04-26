import { Request, Response, NextFunction } from 'express';
import * as authService from '../services/auth.service.js';

export async function getCoach(req: Request, res: Response, next: NextFunction) {
  try {
    const coach = await authService.findCoach();
    if (!coach) {
      const err = new Error('Coach not found') as Error & { statusCode: number };
      err.statusCode = 404;
      throw err;
    }
    res.json({ id: coach.id, name: coach.name, email: coach.email, role: coach.role });
  } catch (err) {
    next(err);
  }
}

export async function getAthletes(req: Request, res: Response, next: NextFunction) {
  try {
    const athletes = await authService.findAllAthletes();
    res.json(athletes.map((a) => ({ id: a.id, name: a.name, email: a.email, role: a.role })));
  } catch (err) {
    next(err);
  }
}
