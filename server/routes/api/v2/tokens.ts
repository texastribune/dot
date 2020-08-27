/* eslint-disable @typescript-eslint/camelcase */

import axios from 'axios';
import express from 'express';

import {
  AUTH0_CLIENT_ID,
  AUTH0_REDIRECT_URI,
  AUTH0_TOKEN_URL,
} from '../../../../shared-config';
import { AUTH0_CLIENT_SECRET } from '../../../config';
import { ResponseError, UnauthorizedError, Auth0Error } from '../../../errors';
import noCacheMiddleware from '../../../middleware/no-cache';

const router = express.Router();

router.use(noCacheMiddleware);
router.get('/', async (req, res, next) => {
  const { code } = req.query;

  try {
    const { data: tokens } = await axios.post<auth0.Auth0Result>(
      AUTH0_TOKEN_URL,
      {
        code,
        client_id: AUTH0_CLIENT_ID,
        client_secret: AUTH0_CLIENT_SECRET,
        grant_type: 'authorization_code',
        redirect_uri: AUTH0_REDIRECT_URI,
      }
    );

    return res.json({ tokens });
  } catch (error) {
    if (error instanceof ResponseError) {
      const responseError = error as ResponseError<auth0.Auth0Error>;
      const invalidCode =
        responseError.data &&
        responseError.data.error_description === 'Invalid authorization code';

      if (invalidCode) {
        return next(
          new UnauthorizedError({
            message: 'Invalid authorization code',
          })
        );
      }

      return next(
        new Auth0Error({
          message: 'Error retrieving authorization tokens',
          extra: responseError.formatExtra(),
        })
      );
    }

    return next(error);
  }
});

export default router;
