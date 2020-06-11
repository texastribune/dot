/* eslint-disable @typescript-eslint/camelcase */

import axios from 'axios';
import express from 'express';

import {
  AUTH0_CLIENT_ID,
  AUTH0_CLIENT_SECRET,
  AUTH0_REDIRECT_URI,
  AUTH0_TOKEN_URL,
} from '../../../../config';
import { ResponseError, SignInError } from '../../../errors';

const router = express.Router();

router.get('/', async (req, res, next) => {
  const { code } = req.query;

  try {
    const { data } = await axios.post<auth0.Auth0Result>(AUTH0_TOKEN_URL, {
      code,
      client_id: AUTH0_CLIENT_ID,
      client_secret: AUTH0_CLIENT_SECRET,
      grant_type: 'authorization_code',
      redirect_uri: AUTH0_REDIRECT_URI,
    });

    return res.header('Cache-Control', 'no-cache').json({ tokens: data });
  } catch (error) {
    if (error instanceof ResponseError) {
      const responseError = error as ResponseError<auth0.Auth0Error>;

      if (responseError.extra && responseError.extra.data) {
        if (
          responseError.extra.data.error_description ===
          'Invalid authorization code'
        ) {
          return next(
            new SignInError({
              message: 'Invalid authorization code',
              status: 403,
            })
          );
        }
      }

      return next(
        new SignInError({
          message: 'Error retrieving Auth0 tokens',
          status: 500,
          extra: responseError.extra,
        })
      );
    }

    return next(
      new SignInError({
        message: 'Error requesting Auth0 tokens',
        status: 500,
      })
    );
  }
});

export default router;
