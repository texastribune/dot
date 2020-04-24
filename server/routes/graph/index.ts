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
import AppError from '../../errors';
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    error: any,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    if (error instanceof Error) {
      let status = 500;
      const { message, name } = error;

      if (error instanceof jwt.UnauthorizedError) {
        status = 401;
      } else if (error instanceof jwksRsa.ArgumentError) {
        status = 500;
      } else if (error instanceof jwksRsa.JwksError) {
        status = 500;
      } else if (error instanceof jwksRsa.SigningKeyNotFoundError) {
        status = 500;
      } else if (error instanceof jwksRsa.JwksRateLimitError) {
        status = 429;
      }

      return next(new AppError({ message, name, status }));
    }

    return next(error);
  }
);

export default router;
