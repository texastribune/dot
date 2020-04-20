import express from 'express';
import * as Sentry from '@sentry/node';

import { IS_DEV } from '../../config';
import apiRoutes from './api';
import dashboardRoutes from './dashboard';

interface RouterError extends Error {
  status?: number;
}

const router = express.Router();

// main routes
router.use('/api', apiRoutes);
router.use('/dashboard', dashboardRoutes);

// error handlers
router.use(Sentry.Handlers.errorHandler() as express.ErrorRequestHandler);
router.use(
  '/api',
  (
    err: RouterError,
    req: express.Request,
    res: express.Response,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    next: express.NextFunction
  ) => {
    res.status(err.status || 500).json({
      message: err.message,
      error: IS_DEV ? err : {},
    });
  }
);

export default router;
