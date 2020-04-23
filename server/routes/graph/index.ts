import express from 'express';
import graphql from 'express-graphql';
import jwt from 'express-jwt';
import { makeExecutableSchema } from 'graphql-tools';
import axios, { AxiosError } from 'axios';

import { IS_DEV, AUTH0_DOMAIN, AUTH0_CLIENT_ID } from '../../../config';
import { PublicKeyError, UnauthorizedError } from '../../errors';
import typeDefs from './types';
import resolvers from './resolvers';

interface PublicKey {
  alg: string;
  kty: string;
  use: string;
  n: string;
  e: string;
  kid: string;
  x5t: string;
  x5c: string[];
}

const PUBLIC_KEY_URL = `https://${AUTH0_DOMAIN}/.well-known/jwks.json`;
const JWT_ISSUER = `https://${AUTH0_DOMAIN}/`;
const JWT_AUDIENCE = AUTH0_CLIENT_ID;

const router = express.Router();

const getPublicKey: jwt.SecretCallback = (req, payload, done): void => {
  axios
    .get<{ keys: PublicKey[] }>(PUBLIC_KEY_URL)
    .then(({ data: publicKey }) => {
      done(null, JSON.stringify(publicKey));
    })
    .catch((error) => {
      const axiosError: AxiosError<PublicKey[]> = error;
      done(
        new PublicKeyError({
          message: axiosError.message,
          extra: axiosError.toJSON(),
        })
      );
    });
};

router.use(
  jwt({
    secret: getPublicKey,
    audience: JWT_AUDIENCE,
    issuer: JWT_ISSUER,
  }),
  graphql({
    schema: makeExecutableSchema({ typeDefs, resolvers }),
    graphiql: IS_DEV,
  })
);

router.use(
  (
    error: Error,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    if (error.name === 'UnauthorizedError') {
      next(new UnauthorizedError({ message: error.message }));
    } else {
      next(error);
    }
  }
);

export default router;
