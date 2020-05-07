import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { URL } from 'url';

import express from 'express';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';

import {
  APP_URL,
  VERSION,
  TRACKER_STATIC_ALIAS,
  TRACKER_BUILD_PATH,
  TRACKER_SCRIPT,
  ACCESS_IDS,
  PING_JWT_SECRET,
} from '../../../../config';
import { TrackerEndpointError } from '../../../errors';

const VALID_SOURCES = ['repub'];
const router = express.Router();

// authorization middleware
router.get('/', (req, res, next) => {
  if (!req.headers.authorization) {
    return next(
      new TrackerEndpointError({
        status: 401,
        message: 'No authorization token',
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
      new TrackerEndpointError({
        status: 403,
        message: 'Invalid authorization token',
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
      new TrackerEndpointError({
        status: 400,
        message: 'Missing required query parameters',
      })
    );
  }

  if (!VALID_SOURCES.includes(source)) {
    return next(
      new TrackerEndpointError({
        status: 400,
        message: 'Invalid source',
      })
    );
  }

  if (!PING_JWT_SECRET) {
    return next(
      new TrackerEndpointError({
        status: 500,
        message: 'Error fetching trackers',
      })
    );
  }

  try {
    // eslint-disable-next-line no-new
    new URL(canonical);
  } catch (err) {
    return next(
      new TrackerEndpointError({
        status: 400,
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
      next(
        new TrackerEndpointError({
          status: 500,
          message: 'Error fetching trackers',
          extra: {
            detail: fileReadError.message,
          },
        })
      );
    } else {
      jwt.sign(
        {
          version: VERSION,
          canonical,
          source,
          tracker: 'script',
        },
        PING_JWT_SECRET as string,
        { algorithm: 'HS256', jwtid: uuidv4() },
        (jwtError, token) => {
          if (jwtError) {
            next(
              new TrackerEndpointError({
                status: 500,
                message: 'Error fetching trackers',
                extra: {
                  detail: jwtError.message,
                },
              })
            );
          } else {
            const sriAlg = 'sha256';
            const hash = crypto
              .createHash(sriAlg)
              .update(data, 'utf8')
              .digest('base64');

            res.header('Cache-Control', 'no-cache');
            res.json({
              script: `<script src="${APP_URL}${TRACKER_STATIC_ALIAS}${VERSION}/${TRACKER_SCRIPT}" data-token="${token}" data-host="${APP_URL}" data-version="${VERSION}" integrity="${sriAlg}-${hash}" crossorigin="anonymous"></script>`,
            });
          }
        }
      );
    }
  });
});

export default router;
