import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { URL } from 'url';

import express from 'express';
import jwt from 'jsonwebtoken';

import { APP_URL } from '../../../../shared-config';
import {
  ACCESS_IDS,
  TRACKER_STATIC_ALIAS,
  TRACKER_BUILD_PATH,
  TRACKER_SCRIPT,
  TRACKER_JWT_SECRET,
  VERSION,
} from '../../../config';
import { UnauthorizedError, TrackerCreationError } from '../../../errors';
import { ValidTrackerSource } from '../../../types';

const router = express.Router();

// authorization middleware
router.get('/', (req, res, next) => {
  if (!req.headers.authorization) {
    return next(
      new UnauthorizedError({
        message: 'No authorization ID',
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

  if (!isAllowed) {
    return next(
      new UnauthorizedError({
        message: 'Invalid authorization ID',
      })
    );
  }

  return next();
});

// validation middleware
router.get('/', (req, res, next) => {
  const { canonical, source } = req.query;

  if (typeof canonical !== 'string' || typeof source !== 'string') {
    return next(
      new TrackerCreationError({
        message: 'Invalid query parameters',
      })
    );
  }

  if (
    !Object.values(ValidTrackerSource).includes(source as ValidTrackerSource)
  ) {
    return next(
      new TrackerCreationError({
        message: 'Invalid source',
      })
    );
  }

  try {
    // eslint-disable-next-line no-new
    new URL(canonical);
  } catch (err) {
    return next(
      new TrackerCreationError({
        message: 'Invalid canonical URL',
      })
    );
  }

  return next();
});

router.get('/', (req, res, next) => {
  const { canonical, source } = req.query as {
    canonical: string;
    source: string;
  };

  const latestScriptPath = path.join(
    TRACKER_BUILD_PATH,
    VERSION,
    TRACKER_SCRIPT
  );

  fs.readFile(latestScriptPath, 'utf8', (fileReadError, data) => {
    if (fileReadError) {
      return next(fileReadError);
    }

    return jwt.sign(
      {
        version: VERSION,
        canonical,
        source,
      },
      TRACKER_JWT_SECRET as string,
      { algorithm: 'HS256', noTimestamp: true },
      (jwtError, token) => {
        if (jwtError) {
          return next(jwtError);
        }

        const sriAlg = 'sha256';
        const hash = crypto
          .createHash(sriAlg)
          .update(data, 'utf8')
          .digest('base64');

        return res.header('Cache-Control', 'no-cache').json({
          script: `<script src="${APP_URL}${TRACKER_STATIC_ALIAS}${VERSION}/${TRACKER_SCRIPT}" data-dot-token="${token}" data-dot-url="${APP_URL}" integrity="${sriAlg}-${hash}" crossorigin="anonymous"></script>`,
        });
      }
    );
  });
});

export default router;
