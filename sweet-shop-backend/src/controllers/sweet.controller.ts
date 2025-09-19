import { Request, Response } from "express";
import SweetModel from "../models/sweet.model";
import { validateSweet } from "../utils/validateSweet";
import { successResponse, errorResponse } from "../utils/responseHelper";

export async function addSweet(req: Request, res: Response) {
  try {
    const validationError = validateSweet(req.body);
    if (validationError) return errorResponse(res, validationError, 400);

    const sweet = await SweetModel.create(req.body);
    return successResponse(res, { sweet }, 201);
  } catch (err) {
    console.error(err);
    return errorResponse(res, "Internal server error", 500);
  }
}

export async function listSweets(req: Request, res: Response) {
  try {
    const sweets = await SweetModel.find().lean();
    return successResponse(res, { sweets });
  } catch (err) {
    console.error(err);
    return errorResponse(res, "Internal server error", 500);
  }
}

export async function searchSweets(req: Request, res: Response) {
  try {
    const { name, category, minPrice, maxPrice } = req.query;
    const filter: any = {};

    if (name) filter.name = { $regex: name.toString(), $options: "i" };
    if (category) filter.category = { $regex: category.toString(), $options: "i" };
    if (minPrice || maxPrice) filter.price = {};
    if (minPrice) filter.price.$gte = Number(minPrice);
    if (maxPrice) filter.price.$lte = Number(maxPrice);

    const sweets = await SweetModel.find(filter).lean();
    return successResponse(res, { sweets });
  } catch (err) {
    console.error(err);
    return errorResponse(res, "Internal server error", 500);
  }
}

export async function updateSweet(req: Request, res: Response) {
  try {
    const sweet = await SweetModel.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true }).lean();
    if (!sweet) return errorResponse(res, "Sweet not found", 404);
    return successResponse(res, { sweet });
  } catch (err) {
    console.error(err);
    return errorResponse(res, "Internal server error", 500);
  }
}

export async function deleteSweet(req: Request, res: Response)
 {
  try {
    const sweet = await SweetModel.findByIdAndDelete(req.params.id);
    if (!sweet) return res.status(404).json({ message: "Sweet not found" });

    return res.status(200).json({ message: "Sweet deleted successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
}