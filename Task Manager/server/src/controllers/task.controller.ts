// server/src/controllers/task.controller.ts
import { Response } from "express";
import Task from "../models/Task.ts";
import { AuthRequest } from "../middleware/auth.middleware.ts";
import { io } from "../server.ts";

export const createTask = async (req: AuthRequest, res: Response) => {
  try {
    console.log("Inside Create Task Controller.")
    const { title, description, assignedTo } = req.body;

    const task = await Task.create({
      title,
      description,
      assignedTo,
      createdBy: req.user!.id
    });

    // 🔔 Notify assigned user
    io.to(assignedTo).emit("task:assigned", {
      message: "New task assigned",
      task
    });

    res.status(201).json(task);
  } catch {
    res.status(500).json({ message: "Failed to create task" });
  }
};

export const getTasks = async (req: AuthRequest, res: Response) => {
  try {
    console.log("Inside Get Tasks Controller.")
    const filter =
      req.user!.role === "admin"
        ? {}
        : { assignedTo: req.user!.id };

    const tasks = await Task.find(filter)
      .sort({ createdAt: -1 })
      .populate("assignedTo", "username")
      .populate("createdBy", "username");

    res.json(tasks);
  } catch {
    res.status(500).json({ message: "Failed to fetch tasks" });
  }
};

export const updateTaskStatus = async (req: AuthRequest, res: Response) => {
  try {
    console.log("Inside Update Task Status Controller.")
    const { status } = req.body;
    const taskId = req.params.id;

    if (!["todo", "in-progress", "done"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const task = await Task.findById(taskId)
      .populate("assignedTo", "username")
      .populate("createdBy", "username");

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    if (task.assignedTo._id.toString() !== req.user!.id) {
      return res.status(403).json({ message: "Not allowed" });
    }

    task.status = status;
    await task.save();

    // 🔔 Notify ADMIN (task creator)
    io.to(task.createdBy._id.toString()).emit(
      "task:status-updated",
      {
        message: `Task "${task.title}" marked as ${status}`,
        task
      }
    );

    res.json(task);
  } catch {
    res.status(500).json({ message: "Failed to update status" });
  }
};
