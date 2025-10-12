import express from 'express';
import {
  createPortfolio,
  deletePortfolio,
  getAllPortfolio,
} from '../controller/portfolio.controller.js';
import { verifyAuth } from '../middlewares/auth.middleware.js';
import upload from '../middlewares/upload.js';

const portfolioRouter = express.Router();

portfolioRouter.get('/portfolios', verifyAuth, getAllPortfolio);
portfolioRouter.post(
  '/portfolios',
  verifyAuth,
  upload.single('pdf'),
  createPortfolio,
);
portfolioRouter.delete('/portfolios/:id', verifyAuth, deletePortfolio);

export default portfolioRouter;
