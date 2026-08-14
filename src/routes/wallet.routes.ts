import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware.js";
import { deposit, getWalletBalance, withdraw } from "../controllers/wallet.controller.js";


const router = Router();

router.post("/deposit", authenticate, deposit);

router.get("/", authenticate, getWalletBalance);

router.post("/deposit", authenticate, deposit);

router.post("/withdraw", authenticate, withdraw);

export default router;