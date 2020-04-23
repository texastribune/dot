import express from 'express';

import apiRoutes from './api';
import graphRoutes from './graph';
import dashboardRoutes from './dashboard';

const router = express.Router();

router.use('/api', apiRoutes);
router.use('/graph', graphRoutes);
router.use('/dashboard', dashboardRoutes);

export default router;
