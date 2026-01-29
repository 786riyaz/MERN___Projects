// client/src/api/auth.api.ts
import api from "./axios";

export const loginApi = (data: {
  username: string;
  password: string;
}) => api.post("/auth/login", data);
