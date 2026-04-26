import { Request, Response, NextFunction } from 'express';
import * as agentService from '../services/agent.service.js';

export async function planWeek(req: Request, res: Response, next: NextFunction) {
  try {
    const { athleteId, coachId, weekOf, instructions } = req.body;
    const sessions = await agentService.planWeek({ athleteId, coachId, weekOf, instructions });
    res.json({ sessions });
  } catch (err) {
    next(err);
  }
}
