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
import { IS_DEV } from '../../config';
import {
  AppError,
  EnhancedError,
  UnauthorizedError,
  RateLimitError,
} from '../../errors';
import reportError from '../../utils/report-error';
import typeDefs from './schema';
import resolvers from './resolvers';

const router = express.Router();

router.use(
  (req, res, next) => {
    res.set('Cache-Control', 'no-store');
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
    customFormatErrorFn(error) {
      const { originalError } = error;

      reportError(originalError || error);

      if (originalError && originalError instanceof AppError) {
        return {
          status: originalError.status,
          message: originalError.message,
        };
      }
      return {
        status: 500,
        message: statuses(500),
      };
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
      return next(new UnauthorizedError({ message: 'Invalid access token' }));
    }

    if (error instanceof jwksRsa.JwksRateLimitError) {
      return next(new RateLimitError());
    }

    return next(error);
  }
);

export default router;
