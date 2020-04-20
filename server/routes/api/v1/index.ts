import express from 'express';

const router = express.Router();

router.get('/test', (req, res) => {
  res.json({ foo: 'bar' });
});

export default router;
