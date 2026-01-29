// client/src/api/user.api.ts
import api from "./axios";

export const getUsers = () => api.get("/users");
