import axios from "axios";

export const API = axios.create({
  baseURL: "http://localhost:5500/api/v1",
  withCredentials: true,
});

export const getArticles = () => API.get("/articles");
export const getArticleDetail = (id: string) => API.get(`/articles/${id}`)
export const buyNowArticle = (id: string) => API.post(`/articles/${id}/buy-now`);