import express from 'express';

import Book from '../models/Book';
import logger from '../logs';

const router = express.Router();

router.use((req, res, next) => {
  logger.info('Checking if admin and user');
  if (!req.user || !req.user.isAdmin) {
    res.status(401).json({ error: 'Unauthorized access' });
    return;
  }

  next();
});

router.get('/books', async (req, res) => {
  logger.info('Querying books...');
  try {
    const books = await Book.list();
    res.json(books);
  } catch (e) {
    res.json({ error: e.message || e.toString() });
  }
});

export default router;
