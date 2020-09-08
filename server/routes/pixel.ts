import express from 'express';
import jwt from 'jsonwebtoken';
import semver from 'semver';

import { TRACKER_JWT_SECRET } from '../config';
import { TrackerTokenPayload } from '../types';
import View from '../models/view';
import noCacheMiddleware from '../middleware/no-cache';
import reportError from '../utils/report-error';

const router = express.Router();
const gif = Buffer.from(
  'R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==',
  'base64'
);

router.use('/pixel.gif', noCacheMiddleware);

router.get('/pixel.gif', async (req, res) => {
  const { token, domain } = req.query;

  try {
    const tokenPayload = await new Promise((resolve, reject) => {
      jwt.verify(
        token as string,
        TRACKER_JWT_SECRET as string,
        {
          algorithms: ['HS256'],
          ignoreExpiration: true,
        },
        (error, payload) => {
          if (error) {
            reject(error);
          } else {
            resolve(payload);
          }
        }
      );
    });

    const { canonical, source, version } = tokenPayload as TrackerTokenPayload;

    if (semver.gte(version, '2.1.0')) {
      const view = await View.create({
        canonical,
        source,
        domain: domain || null,
      });

      await view.save();

      // eslint-disable-next-line no-console
      console.log(
        `Logged view | Canonical: ${view.canonical} | Domain: ${view.domain} | Source: ${view.source}`
      );
    }
  } catch (error) {
    reportError(error);
  } finally {
    res
      .set({
        'Content-Type': 'image/gif',
        'Content-Length': gif.length,
      })
      .send(gif);
  }
});

export default router;
