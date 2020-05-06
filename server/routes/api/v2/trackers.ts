import crypto from 'crypto';
import fs from 'fs';
import path from 'path';

import express from 'express';

import {
  VERSION,
  TRACKER_BUILD_PATH,
  TRACKER_SCRIPT,
  ACCESS_IDS,
} from '../../../../config';
import { TrackerEndpointError } from '../../../errors';

const router = express.Router();

router.get('/', (req, res, next) => {
  if (!req.headers.authorization) {
    return next(
      new TrackerEndpointError({
        status: 401,
        message: 'No authorization header',
      })
    );
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

  return next(
    new TrackerEndpointError({
      status: 403,
      message: 'Invalid authorization header',
    })
  );
});

router.get('/', (req, res, next) => {
  const latestScriptPath = path.join(
    TRACKER_BUILD_PATH,
    VERSION,
    TRACKER_SCRIPT
  );

  fs.readFile(latestScriptPath, 'utf8', (error, data) => {
    if (error) {
      next(
        new TrackerEndpointError({
          status: 500,
          message: error.message,
        })
      );
    } else {
      const alg = 'sha256';
      const hash = crypto.createHash(alg).update(data, 'utf8').digest('base64');

      res.header('Cache-Control', 'no-cache');
      res.json({ hash: `${alg}-${hash}` });
    }
  });
});

export default router;
