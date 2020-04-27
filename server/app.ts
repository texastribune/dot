// eslint-disable-next-line import/no-extraneous-dependencies
import webpackDev from 'webpack-dev-middleware';
// eslint-disable-next-line import/no-extraneous-dependencies
import webpack from 'webpack';
import express from 'express';
import * as Sentry from '@sentry/node';
import connectSlashes from 'connect-slashes';

import webpackConfig from '../webpack.config';
import {
  IS_DEV,
  PORT,
  DASHBOARD_STATIC_ALIAS,
  DASHBOARD_BUILD_PATH,
  TEMPLATES_PATH,
  PUBLIC_BUILD_PATH,
  SENTRY_ENVIRONMENT,
  ENABLE_SENTRY,
  SENTRY_DSN,
} from '../config';
import routes from './routes';
import logError from './utils/log-error';
import { EnhancedError } from './errors';

if (ENABLE_SENTRY) {
  Sentry.init({
    dsn: SENTRY_DSN,
    environment: SENTRY_ENVIRONMENT,
  });
}

const app = express();

app.use(Sentry.Handlers.requestHandler() as express.RequestHandler);

app.set('views', TEMPLATES_PATH);
app.set('view engine', 'pug');

app.use(express.static(PUBLIC_BUILD_PATH));
app.use(DASHBOARD_STATIC_ALIAS, express.static(DASHBOARD_BUILD_PATH));
app.use(connectSlashes());

if (IS_DEV) {
  app.use(webpackDev(webpack(webpackConfig as webpack.Configuration)));
}

app.get('/', (req, res) => {
  res.redirect(302, '/dashboard');
});
app.use(routes);
app.use(
  (
    error: EnhancedError,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    if (!error.status || error.status >= 500) {
      logError(error);
    }
    next(error);
  }
);
app.use(
  '(/api*|/graph*)',
  (
    error: EnhancedError,
    req: express.Request,
    res: express.Response,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    next: express.NextFunction
  ) => {
    res.status(error.status || 500).json({
      message: error.message,
      error: IS_DEV ? error : {},
    });
  }
);

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Listening at port ${PORT}`);
});