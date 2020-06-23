import webpackDev from 'webpack-dev-middleware';
import webpack from 'webpack';
import express from 'express';
import * as Sentry from '@sentry/node';
import connectSlashes from 'connect-slashes';
import morgan from 'morgan';
import statuses from 'statuses';
import axios, { AxiosError } from 'axios';

import webpackConfig from '../webpack.config';
import {
  IS_DEV,
  PORT,
  DASHBOARD_STATIC_ALIAS,
  DASHBOARD_BUILD_PATH,
  TEMPLATES_PATH,
  PUBLIC_BUILD_PATH,
  TRACKER_STATIC_ALIAS,
  TRACKER_BUILD_PATH,
  SENTRY_ENVIRONMENT,
  ENABLE_SENTRY,
  SENTRY_DSN,
} from '../config';
import db from './db';
import routes from './routes';
import pixelRoute from './routes/pixel';
import reportError from './utils/report-error';
import { AppError, EnhancedError, ResponseError } from './errors';

if (ENABLE_SENTRY) {
  Sentry.init({
    dsn: SENTRY_DSN,
    environment: SENTRY_ENVIRONMENT,
  });
}

const app = express();

app.use(morgan(IS_DEV ? 'dev' : 'tiny'));
app.use(Sentry.Handlers.requestHandler() as express.RequestHandler);

app.set('views', TEMPLATES_PATH);
app.set('view engine', 'pug');

app.use(express.static(PUBLIC_BUILD_PATH));
app.use(DASHBOARD_STATIC_ALIAS, express.static(DASHBOARD_BUILD_PATH));
app.use(
  TRACKER_STATIC_ALIAS,
  express.static(TRACKER_BUILD_PATH, {
    setHeaders(res) {
      res.set({ 'Access-Control-Allow-Origin': '*' });
    },
  })
);

if (IS_DEV) {
  app.use(webpackDev(webpack(webpackConfig as webpack.Configuration)));
}

app.use(pixelRoute);
app.use(connectSlashes());
app.use(routes);

app.use(
  (
    error: EnhancedError,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    reportError(error);
    next(error);
  }
);
app.use(
  '/api*',
  (
    error: EnhancedError,
    req: express.Request,
    res: express.Response,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    next: express.NextFunction
  ) => {
    const status = error.status || 500;
    const message =
      error instanceof AppError ? error.message : statuses(status);

    res.header('Cache-Control', 'no-cache').status(status).json({ message });
  }
);

axios.interceptors.response.use(
  (response) => response,
  (error) => {
    const responseError = error as AxiosError;
    const { code, response, message } = responseError;
    const data = response ? response.data : undefined;
    const status = response ? response.status : undefined;
    const gotResponse = !!response;

    return Promise.reject(
      new ResponseError({
        code,
        data,
        gotResponse,
        message,
        status,
      })
    );
  }
);

db.authenticate()
  .then(() => {
    app.listen(PORT, () => {
      // eslint-disable-next-line no-console
      console.log(`Listening at port ${PORT}`);
    });
  })
  .catch((error) => {
    reportError(error);
  });
