import { Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware.js";
import { depositSchema } from "../validators/wallet.validator.js";
import { depositMoney } from "../services/wallet.service.js";

export async function deposit(
  req: AuthRequest,
  res: Response
) {
  const validationResult = depositSchema.safeParse(req.body);

  if (!validationResult.success) {
    return res.status(400).json({
      message: "Invalid request",
      errors: validationResult.error.flatten()
    });
  }

  if (!req.user) {
    return res.status(401).json({
      message: "Authentication required"
    });
  }

  try {
    const wallet = await depositMoney({
      userId: req.user.userId,
      amount: validationResult.data.amount
    });

    return res.status(200).json({
      message: "Money deposited successfully",
      wallet: {
        id: wallet.id,
        balance: wallet.balance.toString()
      }
    });
  } catch (error) {
    if (
      error instanceof Error &&
      error.message === "Wallet not found"
    ) {
      return res.status(404).json({
        message: error.message
      });
    }

    console.error(error);

    return res.status(500).json({
      message: "Internal server error"
    });
  }
}