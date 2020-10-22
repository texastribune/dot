import webpackDev from 'webpack-dev-middleware';
import webpack from 'webpack';
import express from 'express';
import * as Sentry from '@sentry/node';
import connectSlashes from 'connect-slashes';
import helmet from 'helmet';
import morgan from 'morgan';
import statuses from 'statuses';

import webpackConfig from '../webpack.config';
import configureAxios from '../shared-utils/configure-axios';
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
  DEFAULT_CACHE_TIME,
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
import staticFileErrorMiddleware from './middleware/static-file-error';
import reportError from './utils/report-error';
import { AppError, EnhancedError } from './errors';

if (ENABLE_SENTRY) {
  Sentry.init({
    dsn: SENTRY_DSN,
    environment: SENTRY_ENVIRONMENT,
  });
}

const app = express();

// ==============================================================================
// SENTRY MIDDLEWARE
// ==============================================================================
app.use(
  Sentry.Handlers.requestHandler({
    request: ['data', 'headers', 'method', 'query_string', 'url'],
    user: ['id', 'sub'],
    ip: true,
  }) as express.RequestHandler
);

// ==============================================================================
// PROXY HANDLING
// ==============================================================================
app.set('trust proxy', true);

// ==============================================================================
// SECURITY MIDDLEWARE
// ==============================================================================
app.use(
  helmet({
    contentSecurityPolicy: IS_DEV
      ? undefined
      : {
          directives: {
            connectSrc: ["'self'", 'https://*.sentry.io'],
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", `'nonce-${VUETIFY_NONCE}'`],
          },
        },
    expectCt: true,
    permittedCrossDomainPolicies: true,
  })
);

// ==============================================================================
// LOGGING MIDDLEWARE
// ==============================================================================
app.use(
  morgan(
    IS_DEV
      ? 'dev'
      : ':remote-addr :method :url :status :response-time ms - :res[content-length]'
  )
);

// ==============================================================================
// TEMPLATES MIDDLEWARE
// ==============================================================================
app.set('views', TEMPLATES_PATH);
app.set('view engine', 'pug');

// ==============================================================================
// STATIC-FILES MIDDLEWARE
// ==============================================================================
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
  staticFileErrorMiddleware()
);
app.use(
  TRACKER_STATIC_ALIAS,
  express.static(TRACKER_BUILD_PATH, {
    setHeaders(res) {
      res.set({
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'no-cache',
      });
    },
    fallthrough: false,
  }),
  // do not cache 404s because future version numbers are predictable
  staticFileErrorMiddleware({ 'Cache-Control': 'no-cache' })
);

// ==============================================================================
// CACHING MIDDLEWARE
// ==============================================================================
app.use((req, res, next) => {
  if (req.method === 'GET') {
    if (req.headers.authorization) {
      res.set('Cache-Control', 'no-store');
    } else {
      res.set('Cache-Control', `max-age=${DEFAULT_CACHE_TIME}`);
    }
  }
  next();
});

// ==============================================================================
// WEBPACK MIDDLEWARE
// ==============================================================================
if (IS_DEV) {
  app.use(webpackDev(webpack(webpackConfig as webpack.Configuration)));
}

// ==============================================================================
// ROUTING MIDDLEWARE
// ==============================================================================
app.use(legacyRoutes);
app.use(pixelRoute);
app.use(connectSlashes());
app.use(routes);

// ==============================================================================
// ERROR-HANDLING MIDDLEWARE
// ==============================================================================
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

    if (error instanceof AppError) {
      res.status(status).json({ message: error.message });
    } else {
      res.status(status).json({ message: statuses(status) });
    }
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
    const status = error.status || 500;

    if (error instanceof AppError) {
      res.status(500).json({ errors: [{ status, message: error.message }] });
    } else {
      res.status(500).json({ errors: [{ status, message: statuses(status) }] });
    }
  }
);

app.use(
  (
    error: EnhancedError,
    req: express.Request,
    res: express.Response,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    next: express.NextFunction
  ) => {
    const status = error.status || 500;
    let heading = 'An error occurred';
    let message = 'We will do our best to figure it out!';

    if (status >= 500) {
      heading = 'Sorry, we messed up';
      message = "We will check out the problem, don't you worry!";
    } else if (status >= 400) {
      heading = 'Well, that was odd';
      message = 'You might have done something funky with the URL.';
    }

    res.status(status).render('error', { heading, message });
  }
);

// ==============================================================================
// HANDLE 404s
// ==============================================================================
app.use((req, res) => {
  if (req.path.startsWith('/api')) {
    res.status(404).json({ message: statuses(404) });
  } else {
    res.render('error', {
      heading: 'Page not found',
      message: 'You stumbled on a page that does not exist on the Internet.',
    });
  }
});

// ==============================================================================
// CONFIGURE AXIOS
// ==============================================================================
configureAxios();

// ==============================================================================
// START NODE
// ==============================================================================
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
