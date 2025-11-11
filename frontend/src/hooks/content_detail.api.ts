import axios from "axios";

export const API = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE,
  withCredentials: true,
});

export const getArticles = () => API.get("/articles");
export const getArticleDetail = (id: string) => API.get(`/articles/${id}`)
export const buyNowArticle = (id: string) => API.post(`/articles/${id}/buy-now`);