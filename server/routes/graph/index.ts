import express from 'express';
import graphql from 'express-graphql';
import jwt from 'express-jwt';
import jwksRsa from 'jwks-rsa';
import { makeExecutableSchema } from 'graphql-tools';

import {
  IS_DEV,
  AUTH0_API_AUDIENCE,
  AUTH0_JWT_ISSUER,
  AUTH0_PUBLIC_KEY_URL,
  AUTH0_JWT_ALGORITHM,
} from '../../../config';
import { EnhancedError, UnauthorizedError, PublicKeyError } from '../../errors';
import typeDefs from './types';
import resolvers from './resolvers';

const router = express.Router();

router.use(
  jwt({
    secret: jwksRsa.expressJwtSecret({
      jwksUri: AUTH0_PUBLIC_KEY_URL,
    }),
    algorithms: [AUTH0_JWT_ALGORITHM],
    audience: AUTH0_API_AUDIENCE,
    issuer: AUTH0_JWT_ISSUER,
  }),
  graphql({
    schema: makeExecutableSchema({ typeDefs, resolvers }),
    graphiql: IS_DEV,
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
      return next(new UnauthorizedError({ message: error.message }));
    }
    if (
      error instanceof jwksRsa.ArgumentError ||
      error instanceof jwksRsa.JwksError ||
      error instanceof jwksRsa.SigningKeyNotFoundError
    ) {
      return next(new PublicKeyError({ message: error.message, status: 500 }));
    }
    if (error instanceof jwksRsa.JwksRateLimitError) {
      return next(new PublicKeyError({ message: error.message, status: 429 }));
    }

    return next(error);
  }
);

export default router;