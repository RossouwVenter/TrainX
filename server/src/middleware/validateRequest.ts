import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';

export function validateRequest(schema: ZodSchema) {
  return (req: Request, _res: Response, next: NextFunction) => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        const error = new Error('Validation failed') as Error & { statusCode: number; details: unknown };
        error.statusCode = 400;
        error.details = err.errors;
        next(error);
      } else {
        next(err);
      }
    }
  };
}
