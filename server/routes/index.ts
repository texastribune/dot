import express from 'express';

import View from '../models/view';
import { CreateViewArgs } from '../types';
import apiRoutes from './api';
import dashboardRoutes from './dashboard';
import graphRoutes from './graph';
import logIn from './log-in';
import loggedIn from './logged-in';

const router = express.Router();
const gif = Buffer.from(
  'R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==',
  'base64'
);

router.get('/', (req, res) => {
  res.render('index');
});

router.get('/pixel.gif', async (req, res) => {
  // ERROR HANDLING NEEDED
  const { token, domain, referrer } = req.query;

  try {
    const view = await View.createView({
      token: token as CreateViewArgs['token'],
      domain: domain as CreateViewArgs['domain'],
      referrer: referrer as CreateViewArgs['referrer'],
    });

    // eslint-disable-next-line no-console
    console.log(
      `Logged view | Canonical: ${view.canonical} | Domain: ${view.domain} | Source: ${view.source} | Type: ${view.type}`
    );
  } catch (err) {
    // next(err);
  }

  res.set({
    'Cache-Control': 'no-cache',
    'Content-Type': 'image/gif',
    'Content-Length': gif.length,
  });
  res.send(gif);
});

router.use('/api', apiRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/graph', graphRoutes);
router.use('/log-in', logIn);
router.use('/logged-in', loggedIn);

export default router;
