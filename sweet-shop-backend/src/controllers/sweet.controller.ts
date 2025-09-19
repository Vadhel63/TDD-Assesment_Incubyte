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
