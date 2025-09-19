// src/app.ts
import express, { Request, Response } from "express";
import authRoutes from "./routes/auth.route"

const app = express();
app.use(express.json());

app.use("/api/auth", authRoutes);

app.get("/", (_req: Request, res: Response) => {
  res.status(200).json({ message: "Sweet Shop API" });
});

app.use((_req: Request, res: Response) => {
  res.status(404).json({ error: "Not Found" });
});

export default app;
