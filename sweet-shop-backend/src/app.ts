// src/app.ts
import express, { Request, Response } from "express";
import cors from"cors"
import authRoutes from "./routes/auth.route"
import sweetRoutes from "./routes/sweet.route"
const app = express();
app.use(express.json());
app.use(cors({
  origin: "http://localhost:5173", // your frontend origin
  credentials: true,               // if you need cookies/auth
}));

app.use("/api/auth", authRoutes);
app.use("/api",sweetRoutes)
app.get("/", (_req: Request, res: Response) => {
  res.status(200).json({ message: "Sweet Shop API" });
});

app.use((_req: Request, res: Response) => {
  res.status(404).json({ error: "Not Found" });
});

export default app;
