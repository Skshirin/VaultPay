import { Router } from "express";
import {
  authenticate,
  AuthRequest
} from "../middleware/auth.middleware.js";

const router = Router();

router.get("/me", authenticate, (req: AuthRequest, res) => {
  return res.json({
    message: "Authenticated successfully",
    userId: req.user?.userId
  });
});

export default router;