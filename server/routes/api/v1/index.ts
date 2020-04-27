/* eslint-disable @typescript-eslint/camelcase */

import axios from 'axios';
import express from 'express';

import {
  AUTH0_CLIENT_ID,
  AUTH0_CLIENT_SECRET,
  AUTH0_REDIRECT_URI,
  AUTH0_TOKEN_URL,
} from '../../../../config';

const router = express.Router();

router.get('/tokens', async (req, res, next) => {
  const { code } = req.query;

  try {
    const { data } = await axios.post(AUTH0_TOKEN_URL, {
      code,
      client_id: AUTH0_CLIENT_ID,
      client_secret: AUTH0_CLIENT_SECRET,
      grant_type: 'authorization_code',
      redirect_uri: AUTH0_REDIRECT_URI,
    });

    res.json({ tokens: data });
  } catch (err) {
    next(err);
  }
});

export default router;
