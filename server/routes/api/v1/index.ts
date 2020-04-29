/* eslint-disable @typescript-eslint/camelcase */

import axios, { AxiosError } from 'axios';
import express from 'express';

import {
  AUTH0_CLIENT_ID,
  AUTH0_CLIENT_SECRET,
  AUTH0_REDIRECT_URI,
  AUTH0_TOKEN_URL,
} from '../../../../config';
import { TokenRetrievalError } from '../../../errors';

const router = express.Router();

router.get('/tokens', async (req, res, next) => {
  const { code } = req.query;

  try {
    const { data } = await axios.post<auth0.Auth0Result>(AUTH0_TOKEN_URL, {
      code,
      client_id: AUTH0_CLIENT_ID,
      client_secret: AUTH0_CLIENT_SECRET,
      grant_type: 'authorization_code',
      redirect_uri: AUTH0_REDIRECT_URI,
    });

    return res.json({ tokens: data });
  } catch (error) {
    if (error.isAxiosError) {
      const axiosError: AxiosError<auth0.Auth0Error> = error;
      const { response } = axiosError;

      if (
        response &&
        response.data.error_description === 'Invalid authorization code'
      ) {
        return next(
          new TokenRetrievalError({
            message: 'Invalid authorization code',
            status: 403,
          })
        );
      }

      return next(
        new TokenRetrievalError({
          message: 'Error retrieving authorization token',
          extra: {
            error,
            data: response ? response.data : null,
          },
        })
      );
    }

    return next(error);
  }
});

export default router;
