import express from 'express';

const router = express.Router();

router.get('/', (req, res) => {
  res.render('log-in');
});

export default router;
