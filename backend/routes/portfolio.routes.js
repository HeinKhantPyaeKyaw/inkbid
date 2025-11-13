import express from 'express';
import {
  createPortfolio,
  deletePortfolio,
  getAllPortfolio,
} from '../controller/portfolio.controller.js';
import { verifyAuth } from '../middlewares/auth.middleware.js';
import upload from '../middlewares/upload.js';
import Portfolio from '../schemas/portfolio.schema.js';

const portfolioRouter = express.Router();

portfolioRouter.get('/portfolios/:sellerId', async (req, res) => {
  try {
    const { sellerId } = req.params;

    const results = await Portfolio.find({ writer: sellerId })
      .populate('writer', 'name email')
      .sort({ createdAt: -1 });

    if (!results || results.length === 0) {
      return res
        .status(404)
        .json({ error: 'No portfolios found for this seller.' });
    }

    res.status(200).json(results);
  } catch (err) {
    console.error('Error fetching public portfolios: ', err);
    res.status(500).json({ error: 'Server error fetching portfolios' });
  }
});

portfolioRouter.get('/portfolios', verifyAuth, getAllPortfolio);
portfolioRouter.post(
  '/portfolios',
  verifyAuth,
  upload.single('pdf'),
  createPortfolio,
);
portfolioRouter.delete('/portfolios/:id', verifyAuth, deletePortfolio);

export default portfolioRouter;
