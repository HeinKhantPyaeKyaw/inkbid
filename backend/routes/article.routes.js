import express from 'express';
import {
  createArticle,
  getAllArticlesWithBids,
  getArticleWithBids,
  buyNow,
} from '../controller/article.controller.js';
import upload from '../middlewares/upload.js';
import { verifyAuth } from '../middlewares/auth.middleware.js';

const articleRouter = express.Router();

articleRouter.get('/articles', getAllArticlesWithBids);
articleRouter.get('/articles/:id', getArticleWithBids);
articleRouter.post('/articles/:id/buy-now', verifyAuth, buyNow);

// / POST new article(Create Post page)
articleRouter.post(
  '/articles',
  upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'article', maxCount: 1 },
  ]),
  createArticle,
);

export default articleRouter;
