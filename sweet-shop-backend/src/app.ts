import express, { Request, Response } from "express";

const app = express();

// Middleware
app.use(express.json());

app.get("/", (_req: Request, res: Response) => {
  res.status(200).json({ message: "Sweet Shop API running" });
});

app.use((_req: Request, res: Response) => {
  res.status(404).json({ error: "Not Found" });
});

export default app;
