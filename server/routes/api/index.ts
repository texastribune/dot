import express from 'express';

import v2Routes from './v2';

const router = express.Router();

router.use('/v2', v2Routes);

export default router;
