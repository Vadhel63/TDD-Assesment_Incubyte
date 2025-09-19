import jwt from "jsonwebtoken";
import { IUser } from "../models/user.model";

const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

export const generateToken = (user: IUser) => {
  return jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: "1h" }
  );
};
