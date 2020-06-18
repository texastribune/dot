import express from 'express';

import { CreateViewArgs } from '../../shared-types';
import View from '../models/view';
import reportError from '../utils/report-error';

const router = express.Router();
const gif = Buffer.from(
  'R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==',
  'base64'
);

router.get('/pixel.gif', async (req, res) => {
  const { token, domain, referrer, version } = req.query;

  try {
    const view = await View.createView({
      domain: domain as CreateViewArgs['domain'],
      referrer: referrer as CreateViewArgs['referrer'],
      token: token as CreateViewArgs['token'],
      version: version as CreateViewArgs['version'],
    });

    // eslint-disable-next-line no-console
    console.log(
      `Logged view | ID: ${view.id} | Canonical: ${view.canonical} | Domain: ${view.domain} | Source: ${view.source} | Type: ${view.type} | Referrer: ${view.referrer}`
    );
  } catch (error) {
    reportError(error);
  } finally {
    res.set({
      'Cache-Control': 'no-cache',
      'Content-Type': 'image/gif',
      'Content-Length': gif.length,
    });

    res.send(gif);
  }
});

export default router;
