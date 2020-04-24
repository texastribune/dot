import express from 'express';

import apiRoutes from './api';
import dashboardRoutes from './dashboard';

const router = express.Router();

router.use('/api', apiRoutes);
router.use('/dashboard', dashboardRoutes);

export default router;
