import { Request, Response } from "express";
import { TransactionService } from "../services/transaction.service.js";

export class TransactionController {
  constructor(private transactionService: TransactionService) {}

  async getTransactions(
    req: Request<{ walletId: string }>,
    res: Response
  ) {
    try {
      const { walletId } = req.params;

      const transactions =
        await this.transactionService.getTransactions(walletId);

      return res.status(200).json({
        transactions,
      });
    } catch (error) {
      console.error("Error fetching transactions:", error);

      return res.status(500).json({
        message: "Failed to fetch transactions",
      });
    }
  }
}