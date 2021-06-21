import { Request, Response, NextFunction } from 'express';
import morgan, { StreamOptions } from 'morgan';
import logger from './logger';

const stream: StreamOptions = { write: (message) => logger.http(message.replace(/\n$/g, '')) };

const skip = () => {
  const env = process.env.NODE_ENV || 'development';
  return env !== 'development';
};

export const morganMiddleware = morgan(
  ':method :url :status :res[content-length] - :response-time ms',
  { stream, skip },
);

export const authMiddleware = (req: Request, _res: Response, next: NextFunction) => {
  const authorization = req.get('authorization');
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    req.app.locals.token = authorization.substring(7);
  }
  next();
};

export const unknownEndpointMiddleware = (_req: Request, res: Response) => {
  res.status(404).send({ error: 'unknown endpoint' });
};
