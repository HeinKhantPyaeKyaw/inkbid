import express from "express";
import { getAllArticlesWithBids, getArticleWithBids } from "../controller/article.controller.js";
const articleRouter = express.Router();

articleRouter.get("/articles", getAllArticlesWithBids);
articleRouter.get("/articles/:id", getArticleWithBids);

export default articleRouter;
