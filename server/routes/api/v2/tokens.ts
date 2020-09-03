/* eslint-disable @typescript-eslint/camelcase */

import axios from 'axios';
import express from 'express';

import {
  AUTH0_CLIENT_ID,
  AUTH0_REDIRECT_URI,
  AUTH0_TOKEN_URL,
} from '../../../../shared-config';
import { NetworkError } from '../../../../shared-errors';
import { AUTH0_CLIENT_SECRET } from '../../../config';
import noCacheMiddleware from '../../../middleware/no-cache';
import reportError from '../../../utils/report-error';
import { InvalidAuth0CodeError, InternalServerError } from '../../../errors';

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
    if (error instanceof NetworkError) {
      const responseError = error as NetworkError<auth0.Auth0Error>;
      const invalidCode =
        responseError.data &&
        responseError.data.error_description === 'Invalid authorization code';

      if (invalidCode) {
        return next(new InvalidAuth0CodeError());
      }

      reportError(error, { forceReport: true });
      return next(new InternalServerError());
    }

    return next(error);
  }
});

export default router;
