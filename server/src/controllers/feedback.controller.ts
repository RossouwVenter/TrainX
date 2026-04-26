import { Request, Response, NextFunction } from 'express';
import * as feedbackService from '../services/feedback.service.js';

export async function submitFeedback(req: Request, res: Response, next: NextFunction) {
  try {
    const feedback = await feedbackService.createFeedback(req.body);
    res.status(201).json(feedback);
  } catch (err) {
    next(err);
  }
}

export async function getFeedback(req: Request, res: Response, next: NextFunction) {
  try {
    const feedback = await feedbackService.getFeedbackBySessionId(req.params.sessionId);
    if (!feedback) {
      const err = new Error('Feedback not found') as Error & { statusCode: number };
      err.statusCode = 404;
      throw err;
    }
    res.json(feedback);
  } catch (err) {
    next(err);
  }
}
