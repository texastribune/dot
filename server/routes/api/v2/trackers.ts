import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { URL } from 'url';

import express from 'express';
import jwt from 'jsonwebtoken';

import { APP_URL } from '../../../../shared-config';
import noCacheMiddleware from '../../../middleware/no-cache';
import {
  ACCESS_IDS,
  TRACKER_STATIC_ALIAS,
  TRACKER_BUILD_PATH,
  TRACKER_SCRIPT,
  TRACKER_JWT_SECRET,
  VERSION,
  VALID_TRACKER_SOURCE,
} from '../../../config';
import {
  UnauthorizedError,
  ForbiddenError,
  TrackerCreationError,
} from '../../../errors';

const router = express.Router();

// caching middleware
router.use(noCacheMiddleware);

// authorization middleware
router.get('/', (req, res, next) => {
  if (!req.headers.authorization) {
    return next(new UnauthorizedError());
  }

  const [, accessId] = req.headers.authorization.split(' ');
  let isAllowed = false;

  Object.entries(ACCESS_IDS).forEach(([, validAccessId]) => {
    if (validAccessId === accessId) {
      isAllowed = true;
    }
  });

  if (!isAllowed) {
    return next(new ForbiddenError());
  }

  return next();
});

// validation middleware
router.get('/', (req, res, next) => {
  const { canonical, source } = req.query;

  if (typeof canonical !== 'string' || typeof source !== 'string') {
    return next(new TrackerCreationError('Invalid query parameters'));
  }

  if (
    !Object.values(VALID_TRACKER_SOURCE).includes(
      source as VALID_TRACKER_SOURCE
    )
  ) {
    return next(new TrackerCreationError('Invalid source'));
  }

  try {
    // eslint-disable-next-line no-new
    new URL(canonical);
  } catch (err) {
    return next(new TrackerCreationError('Invalid canonical URL'));
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

        return res.json({
          script: `<script async src="${APP_URL}${TRACKER_STATIC_ALIAS}${VERSION}/${TRACKER_SCRIPT}" data-dot-token="${token}" integrity="${sriAlg}-${hash}" crossorigin="anonymous"></script>`,
        });
      }
    );
  });
});

export default router;
