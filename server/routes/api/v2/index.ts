/* eslint-disable @typescript-eslint/camelcase */

import crypto from 'crypto';
import fs from 'fs';
import path from 'path';

import axios, { AxiosError } from 'axios';
import express from 'express';

import {
  VERSION,
  AUTH0_CLIENT_ID,
  AUTH0_CLIENT_SECRET,
  AUTH0_REDIRECT_URI,
  AUTH0_TOKEN_URL,
  TRACKER_BUILD_PATH,
  TRACKER_SCRIPT,
  ACCESS_IDS,
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

    res.header('Cache-Control', 'no-cache');
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
            data: response ? response.data : null,
          },
        })
      );
    }

    return next(error);
  }
});

router.get('/trackers', (req, res, next) => {
  if (!req.headers.authorization) {
    return next(new Error());
  }

  const [, accessId] = req.headers.authorization.split(' ');
  let isAllowed = false;

  Object.entries(ACCESS_IDS).forEach(([, validAccessId]) => {
    if (validAccessId === accessId) {
      isAllowed = true;
    }
  });

  if (isAllowed) {
    return next();
  }
  return next(new Error());
});
router.get('/trackers', (req, res) => {
  const latestScriptPath = path.join(
    TRACKER_BUILD_PATH,
    VERSION,
    TRACKER_SCRIPT
  );

  fs.readFile(latestScriptPath, 'utf8', (error, data) => {
    const alg = 'sha256';
    const hash = crypto.createHash(alg).update(data, 'utf8').digest('base64');

    res.header('Cache-Control', 'no-cache');
    res.json({ hash: `${alg}-${hash}` });
  });
});

export default router;
