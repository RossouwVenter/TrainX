import { Request, Response, NextFunction } from 'express';
import * as authService from '../services/auth.service.js';

const sanitizeUser = (user: { id: string; name: string; email: string; role: string }) => ({
  id: user.id,
  name: user.name,
  email: user.email,
  role: user.role,
});

export async function signup(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, password, name, role } = req.body;
    const user = await authService.signup(email, password, name, role);
    res.status(201).json(sanitizeUser(user));
  } catch (err) {
    next(err);
  }
}

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, password } = req.body;
    const user = await authService.login(email, password);
    res.json(sanitizeUser(user));
  } catch (err) {
    next(err);
  }
}

export async function getCoach(req: Request, res: Response, next: NextFunction) {
  try {
    const coach = await authService.findCoach();
    if (!coach) {
      const err = new Error('Coach not found') as Error & { statusCode: number };
      err.statusCode = 404;
      throw err;
    }
    res.json(sanitizeUser(coach));
  } catch (err) {
    next(err);
  }
}

export async function getAthletes(req: Request, res: Response, next: NextFunction) {
  try {
    const athletes = await authService.findAllAthletes();
    res.json(athletes.map(sanitizeUser));
  } catch (err) {
    next(err);
  }
}
