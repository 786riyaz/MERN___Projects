import api from "./axios";

export const getTasks = () => api.get("/task/tasks");

export const createTask = (data: {
  title: string;
  description: string;
  assignedTo: string;
}) => api.post("/task/tasks", data);

export const updateTaskStatus = (id: string, status: string) =>
  api.patch(`/task/tasks/${id}/status`, { status });
