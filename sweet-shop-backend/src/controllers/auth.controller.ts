import { Request, Response } from "express";
import UserModel from "../models/user.model";
import { generateToken } from "../services/auth.service";

export async function register(req: Request, res: Response) {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email and password are required" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password too weak (min 6 chars)" });
    }

    const existing = await UserModel.findOne({ email }).lean();
    if (existing) {
      return res.status(409).json({ message: "Email already registered" });
    }

    const user = new UserModel({ name, email, password });
    await user.save();

    const token = generateToken(user);

    return res.status(201).json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    });
  } catch (err) {
    return res.status(500).json({ message: "Internal server error" });
  }
}
