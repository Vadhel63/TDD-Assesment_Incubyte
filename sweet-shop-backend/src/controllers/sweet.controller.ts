import { Request, Response } from "express";
import SweetModel from "../models/sweet.model";

export async function addSweet(req: Request, res: Response) {
  try {
    const { name, category, price, quantity } = req.body;
    if (!name || !category || price == null || quantity == null) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const sweet = await SweetModel.create({ name, category, price, quantity });
    return res.status(201).json({ sweet });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
}
