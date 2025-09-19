import { Router } from "express";
import { addSweet ,listSweets,searchSweets,updateSweet,deleteSweet} from "../controllers/sweet.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { adminMiddleware } from "../middlewares/role.middleware";

const router = Router();

router.post("/sweets", authMiddleware, adminMiddleware, addSweet);
router.get("/sweets", authMiddleware, listSweets);
router.get("/sweets/search", authMiddleware, searchSweets);
router.put("/sweets/:id",authMiddleware,adminMiddleware,updateSweet)
router.delete("/sweets/:id",authMiddleware,adminMiddleware,deleteSweet)



export default router;
