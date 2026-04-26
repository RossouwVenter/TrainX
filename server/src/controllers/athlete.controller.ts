import { Request, Response, NextFunction } from 'express';
import * as athleteService from '../services/athlete.service.js';

export async function createAthlete(req: Request, res: Response, next: NextFunction) {
  try {
    const athlete = await athleteService.createAthlete(req.body);
    res.status(201).json(athlete);
  } catch (err: any) {
    if (err?.code === 'P2002') {
      const error = new Error('An athlete with this email already exists') as Error & { statusCode: number };
      error.statusCode = 409;
      return next(error);
    }
    next(err);
  }
}

export async function deleteAthlete(req: Request, res: Response, next: NextFunction) {
  try {
    await athleteService.deleteAthlete(req.params.id);
    res.status(204).send();
  } catch (err: any) {
    if (err?.code === 'P2025') {
      const error = new Error('Athlete not found') as Error & { statusCode: number };
      error.statusCode = 404;
      return next(error);
    }
    next(err);
  }
}

export async function getAthletes(req: Request, res: Response, next: NextFunction) {
  try {
    const athletes = await athleteService.getAllAthletesWithStats();
    res.json(athletes);
  } catch (err) {
    next(err);
  }
}

export async function getAthlete(req: Request, res: Response, next: NextFunction) {
  try {
    const athlete = await athleteService.getAthleteById(req.params.id);
    if (!athlete) {
      const err = new Error('Athlete not found') as Error & { statusCode: number };
      err.statusCode = 404;
      throw err;
    }
    res.json(athlete);
  } catch (err) {
    next(err);
  }
}
