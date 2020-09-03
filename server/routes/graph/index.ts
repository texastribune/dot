import express from 'express';
import graphql from 'express-graphql';
import jwt from 'express-jwt';
import jwksRsa from 'jwks-rsa';
import { GraphQLError } from 'graphql';
import { makeExecutableSchema } from 'graphql-tools';
import statuses from 'statuses';

import {
  AUTH0_API_AUDIENCE,
  AUTH0_JWT_ISSUER,
  AUTH0_PUBLIC_KEY_URL,
} from '../../../shared-config';
import { IS_DEV } from '../../config';
import { AppError, EnhancedError, UnauthorizedError } from '../../errors';
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
      const { originalError } = gqlError;

      if (!originalError || originalError instanceof GraphQLError) {
        const relevantError = originalError || gqlError;
        logError(relevantError);
        return {
          ...relevantError,
          status: 400,
          message: relevantError.message,
        };
      }

      const enhancedError = originalError as EnhancedError;
      const status = enhancedError.status || 500;
      const message =
        enhancedError instanceof AppError
          ? enhancedError.message
          : statuses(status);

      reportError(enhancedError);
      return { ...gqlError, status, message };
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
