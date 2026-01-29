// server/controllers/user.controller.ts
import { Request, Response } from "express";
import User from "../models/User.ts";

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    console.log("Inside Get All Users Controller.")
    const users = await User.find({ role: "user" }).select("_id username");
    res.json(users);
  } catch {
    res.status(500).json({ message: "Failed to fetch users" });
  }
};
