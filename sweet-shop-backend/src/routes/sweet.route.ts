import { Router } from "express";
import { addSweet ,listSweets} from "../controllers/sweet.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { adminMiddleware } from "../middlewares/role.middleware";

const router = Router();
router.post("/sweets", authMiddleware, adminMiddleware, addSweet);
router.get("/sweets", authMiddleware, listSweets);

export default router;
