import express from 'express';
import jwt from 'jsonwebtoken';

import { TRACKER_JWT_SECRET, VALID_TRACKER_SOURCE } from '../config';
import { TrackerTokenPayload } from '../types';
import reportError from '../utils/report-error';
import View from '../models/view';
import noCacheMiddleware from '../middleware/no-cache';

const router = express.Router();
const gif = Buffer.from(
  'R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==',
  'base64'
);

router.use('/pixel.gif', noCacheMiddleware);

router.get('/pixel.gif', async (req, res) => {
  const { token, contest, domain } = req.query;

  try {
    if (contest && typeof contest === 'string') {
      const view = await View.create({
        canonical: `https://apps.texastribune.org/features/2020/general-election-results/embeds/partner/?${contest}`,
        source: VALID_TRACKER_SOURCE.DataViz,
        domain,
      });

      await view.save();
      // eslint-disable-next-line no-console
      console.log(
        `Logged view | Canonical: ${view.canonical} | Domain: ${view.domain} | Source: ${view.source}`
      );
    } else if (token && typeof token === 'string') {
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

      const { canonical, source } = tokenPayload as TrackerTokenPayload;
      const view = await View.create({
        canonical,
        source,
        domain,
      });

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
