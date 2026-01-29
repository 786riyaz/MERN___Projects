// client/src/api/axios.api.ts
import axios from "axios";

const api = axios.create({
  // baseURL: "http://localhost:5000/api"
  baseURL: "https://pfx9d576-5000.inc1.devtunnels.ms/api"
});

api.interceptors.request.use(config => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
