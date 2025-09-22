import axios from "axios";

export const axiosClient = axios.create({
  baseURL: "http://localhost:5500/api/v1",
  withCredentials: false, //turn true later after implementing auth
});
