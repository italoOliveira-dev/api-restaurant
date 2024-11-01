import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { AppError } from '../utils/app-error';

export function errorHandler(
  error: any,
  request: Request,
  response: Response,
  _: NextFunction
) {
  if (error instanceof AppError) {
    response.status(error.statusCode).json({ message: error.message });
    return;
  }

  if (error instanceof ZodError) {
    response
      .status(400)
      .json({ message: 'Validation error', field: error.format() });
    return;
  }

  response.status(500).json({ message: error.message });
}
