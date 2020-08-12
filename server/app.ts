import webpackDev from 'webpack-dev-middleware';
import webpack from 'webpack';
import express from 'express';
import * as Sentry from '@sentry/node';
import connectSlashes from 'connect-slashes';
import helmet from 'helmet';
import morgan from 'morgan';
import statuses from 'statuses';
import axios, { AxiosError } from 'axios';

import webpackConfig from '../webpack.config';
import {
  SENTRY_ENVIRONMENT,
  ENABLE_SENTRY,
  SENTRY_DSN,
  VUETIFY_NONCE,
} from '../shared-config';
import {
  DASHBOARD_CACHE_TIME,
  DASHBOARD_STATIC_ALIAS,
  DASHBOARD_BUILD_PATH,
  IS_DEV,
  PORT,
  PUBLIC_BUILD_PATH,
  TEMPLATES_PATH,
  TRACKER_STATIC_ALIAS,
  TRACKER_BUILD_PATH,
} from './config';
import db from './db';
import routes from './routes';
import pixelRoute from './routes/pixel';
import legacyRoutes from './routes/legacy';
import staticFileError from './middleware/static-file-error';
import reportError from './utils/report-error';
import { AppError, EnhancedError, ResponseError } from './errors';

if (ENABLE_SENTRY) {
  Sentry.init({
    dsn: SENTRY_DSN,
    environment: SENTRY_ENVIRONMENT,
  });
}

const app = express();

app.use(Sentry.Handlers.requestHandler() as express.RequestHandler);
app.use(
  helmet({
    contentSecurityPolicy: IS_DEV
      ? undefined
      : {
          directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", `'nonce-${VUETIFY_NONCE}'`],
          },
        },
    expectCt: true,
    permittedCrossDomainPolicies: true,
  })
);
app.use(morgan(IS_DEV ? 'dev' : 'tiny'));

app.set('views', TEMPLATES_PATH);
app.set('view engine', 'pug');

app.use(express.static(PUBLIC_BUILD_PATH));
app.use(
  DASHBOARD_STATIC_ALIAS,
  express.static(DASHBOARD_BUILD_PATH, {
    setHeaders(res) {
      res.set({
        'Cache-Control': `max-age=${DASHBOARD_CACHE_TIME}`,
      });
    },
    fallthrough: false,
  }),
  staticFileError()
);
app.use(
  TRACKER_STATIC_ALIAS,
  express.static(TRACKER_BUILD_PATH, {
    setHeaders(res) {
      res.set({
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'no-store',
      });
    },
    fallthrough: false,
  }),
  staticFileError()
);

if (IS_DEV) {
  app.use(webpackDev(webpack(webpackConfig as webpack.Configuration)));
}

app.use(legacyRoutes);
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
    res.set('Cache-Control', 'no-store');
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

    res.status(status).json({ message });
  }
);

app.use(
  '/graph*',
  (
    error: EnhancedError,
    req: express.Request,
    res: express.Response,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    next: express.NextFunction
  ) => {
    let status;
    let message;

    if (error instanceof AppError) {
      status = error.status;
      message = error.message;
    } else {
      status = 500;
      message = statuses(500);
    }

    res.status(500).json({ errors: [{ status, message }] });
  }
);

axios.interceptors.response.use(
  (response) => response,
  (error) => {
    const responseError = error as AxiosError;
    const { code, response, message } = responseError;
    const data = response ? response.data : undefined;
    const status = response ? response.status : undefined;

    return Promise.reject(
      new ResponseError({
        code,
        data,
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
