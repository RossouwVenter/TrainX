import { Router } from 'express';
import { authRouter } from './auth.routes.js';
import { sessionRouter } from './session.routes.js';
import { feedbackRouter } from './feedback.routes.js';
import { athleteRouter } from './athlete.routes.js';
import { agentRouter } from './agent.routes.js';
import { commentRouter } from './comment.routes.js';

export const router = Router();

router.use('/auth', authRouter);
router.use('/sessions', sessionRouter);
router.use('/feedback', feedbackRouter);
router.use('/athletes', athleteRouter);
router.use('/agent', agentRouter);
router.use('/comments', commentRouter);
