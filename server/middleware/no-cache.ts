import express from 'express';

export default function noCache(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
): void {
  res.set('Cache-Control', 'no-store');
  next();
}
