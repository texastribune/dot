import express from 'express';

const router = express.Router();

router.use('/static/dist/*', (req, res) => {
  res.status(410).send();
});

router.use('/dot.gif', (req, res) => {
  res.status(410).send();
});

export default router;
