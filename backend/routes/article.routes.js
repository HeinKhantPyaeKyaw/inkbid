import express from 'express';
import {
  createArticle,
  getAllArticlesWithBids,
  getArticleWithBids,
} from '../controller/article.controller.js';
import upload from '../middlewares/upload.js';

const articleRouter = express.Router();

articleRouter.get('/articles', getAllArticlesWithBids);
articleRouter.get('/articles/:id', getArticleWithBids);

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
