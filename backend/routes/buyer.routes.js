import express from 'express';
import { verifyAuth } from '../middlewares/auth.middleware.js';

import {
  downloadArticle,
  downloadContract,
  getBuyerArticles,
  getBuyerInventory,
  proceedPayment,
  signContract,
  getBuyerCompletedArticles,
} from '../controller/buyer.controller.js';

const buyerRouter = express.Router();

buyerRouter.get('/:buyerId/articles', verifyAuth, getBuyerArticles);

buyerRouter.get('/:buyerId/inventory', verifyAuth, getBuyerInventory);

buyerRouter.post(
  '/:buyerId/articles/:articleId/contract',
  verifyAuth,
  signContract,
);

buyerRouter.post(
  '/:buyerId/articles/:articleId/payment',
  verifyAuth,
  proceedPayment,
);

buyerRouter.get(
  '/:buyerId/inventory/:inventoryId/contract',
  verifyAuth,
  downloadContract,
);

buyerRouter.get(
  '/:buyerId/inventory/:inventoryId/article',
  verifyAuth,
  downloadArticle,
);

buyerRouter.get(
  '/:buyerId/completed-articles',
  verifyAuth,
  getBuyerCompletedArticles,
);

export default buyerRouter;
