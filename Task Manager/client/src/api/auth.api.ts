import api from "./axios";

export const loginApi = (data: {
  username: string;
  password: string;
}) => api.post("/auth/login", data);
