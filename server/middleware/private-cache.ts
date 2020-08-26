import express from 'express';

import { DEFAULT_CACHE_TIME } from '../config';

export default function privateCache(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
): void {
  if (req.method === 'GET' && !req.headers.authorization) {
    res.set('Cache-Control', `private, max-age=${DEFAULT_CACHE_TIME}`);
  }
  next();
}
