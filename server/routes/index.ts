import express from 'express';

import apiRoutes from './api';
import dashboardRoutes from './dashboard';
import graphRoutes from './graph';

const router = express.Router();

router.get('/', (req, res) => {
  res.render('index');
});
router.use('/api', apiRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/graph', graphRoutes);

export default router;
