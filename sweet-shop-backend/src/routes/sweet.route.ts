import { Router } from "express";
import { addSweet } from "../controllers/sweet.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { adminMiddleware } from "../middlewares/role.middleware";

const router = Router();
router.post("/sweets", authMiddleware, adminMiddleware, addSweet);
export default router;
