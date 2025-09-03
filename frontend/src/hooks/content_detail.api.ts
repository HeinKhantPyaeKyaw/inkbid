import axios from "axios";

export const API = axios.create({
  baseURL: "http://localhost:5500/api/v1",
  withCredentials: false, //turn true later after implementing auth
});

export const getArticles = () => API.get("/articles");
export const getArticleDetail = (id: string) => API.get(`/articles/${id}`)