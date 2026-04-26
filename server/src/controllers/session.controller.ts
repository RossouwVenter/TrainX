import { Request, Response, NextFunction } from 'express';
import * as sessionService from '../services/session.service.js';

export async function getWeekSchedule(req: Request, res: Response, next: NextFunction) {
  try {
    const { athleteId, weekOf } = req.query;
    if (!athleteId || typeof athleteId !== 'string') {
      const err = new Error('athleteId query parameter is required') as Error & { statusCode: number };
      err.statusCode = 400;
      throw err;
    }
    const schedule = await sessionService.getWeekSchedule(
      athleteId,
      typeof weekOf === 'string' ? weekOf : undefined,
    );
    res.json(schedule);
  } catch (err) {
    next(err);
  }
}

export async function getSessionById(req: Request, res: Response, next: NextFunction) {
  try {
    const session = await sessionService.getSessionById(req.params.id);
    if (!session) {
      const err = new Error('Session not found') as Error & { statusCode: number };
      err.statusCode = 404;
      throw err;
    }
    res.json(session);
  } catch (err) {
    next(err);
  }
}

export async function createSession(req: Request, res: Response, next: NextFunction) {
  try {
    const session = await sessionService.createSession(req.body);
    res.status(201).json(session);
  } catch (err) {
    next(err);
  }
}

export async function updateSession(req: Request, res: Response, next: NextFunction) {
  try {
    const session = await sessionService.updateSession(req.params.id, req.body);
    res.json(session);
  } catch (err) {
    next(err);
  }
}

export async function deleteSession(req: Request, res: Response, next: NextFunction) {
  try {
    await sessionService.deleteSession(req.params.id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

export async function updateSessionStatus(req: Request, res: Response, next: NextFunction) {
  try {
    const session = await sessionService.updateSessionStatus(req.params.id, req.body.status);
    res.json(session);
  } catch (err) {
    next(err);
  }
}
