import express from 'express';

import apiRoutes from './api';
import dashboardRoutes from './dashboard';
import graphRoutes from './graph';
import logIn from './log-in';
import loggedIn from './logged-in';

const router = express.Router();

router.get('/', (req, res) => {
  res.render('index');
});
router.use('/api', apiRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/graph', graphRoutes);
router.use('/log-in', logIn);
router.use('/logged-in', loggedIn);

export default router;
