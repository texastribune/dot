import express from 'express';
import graphql from 'express-graphql';
import jwt from 'express-jwt';
import jwksRsa from 'jwks-rsa';
import { makeExecutableSchema } from 'graphql-tools';
import statuses from 'statuses';

import {
  AUTH0_API_AUDIENCE,
  AUTH0_JWT_ISSUER,
  AUTH0_PUBLIC_KEY_URL,
} from '../../../shared-config';
import {
  AppError,
  EnhancedError,
  UnauthorizedError,
} from '../../../shared-errors';
import { IS_DEV } from '../../config';
import reportError from '../../utils/report-error';
import logError from '../../utils/log-error';
import noCacheMiddleware from '../../middleware/no-cache';
import typeDefs from './schema';
import resolvers from './resolvers';

const router = express.Router();

router.use(
  noCacheMiddleware,
  (req, res, next) => {
    if (req.method === 'GET') {
      // remove the content-type header that Apollo client mistakenly adds to GETs
      // this is bad because express-graphql then assumes it's a POST request
      delete req.headers['content-type'];
    }
    next();
  },
  jwt({
    secret: jwksRsa.expressJwtSecret({
      jwksUri: AUTH0_PUBLIC_KEY_URL,
    }),
    algorithms: ['RS256'],
    audience: AUTH0_API_AUDIENCE,
    issuer: AUTH0_JWT_ISSUER,
  }),
  graphql({
    schema: makeExecutableSchema({ typeDefs, resolvers }),
    graphiql: IS_DEV,
    customFormatErrorFn(gqlError) {
      logError(gqlError);

      if (!gqlError.originalError) {
        return gqlError;
      }

      // TODO: Detect TypeErrors caused by sending invalid scalar format
      // Those should get a 400, not a 500, and give the client the actual error message
      const enhancedError = gqlError.originalError as EnhancedError;
      const status = enhancedError.status || 500;
      const message =
        enhancedError instanceof AppError
          ? enhancedError.message
          : statuses(status);

      if (!status || status >= 500) {
        reportError(enhancedError);
      }
      return { ...gqlError, message };
    },
  })
);

router.use(
  (
    error: EnhancedError,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    if (error instanceof jwt.UnauthorizedError) {
      return next(new UnauthorizedError());
    }
    return next(error);
  }
);

export default router;
