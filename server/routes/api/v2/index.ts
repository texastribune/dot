import express from 'express';

import tokensRoutes from './tokens';
import trackersRoutes from './trackers';

const router = express.Router();

router.use('/tokens', tokensRoutes);
router.use('/trackers', trackersRoutes);

export default router;
