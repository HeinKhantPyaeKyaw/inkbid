import express from 'express';
import {
  createReview,
  getSellerReviews,
} from '../controller/review.controller.js';
import { verifyAuth } from '../middlewares/auth.middleware.js';

const reviewRouter = express.Router();

reviewRouter.post('/', verifyAuth, createReview);

reviewRouter.get('/:sellerId', getSellerReviews);

export default reviewRouter;
