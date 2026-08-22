import { Request, Response } from "express";

export class TransactionController {
  constructor(private transactionService: any) {}

  async getTransactions(
    req: Request<{ walletId: string }>,
    res: Response
  ) {
    try {
      const { walletId } = req.params;

      const transactions =
        await this.transactionService.getTransactions(walletId);

      const formattedTransactions = transactions.map((transaction: any) => ({
        ...transaction,
        amount: transaction.amount.toString(),
        ledgerEntries: transaction.ledgerEntries.map((entry: any) => ({
          ...entry,
          amount: entry.amount.toString(),
        })),
      }));

      return res.status(200).json({
        transactions: formattedTransactions,
      });
    } catch (error) {
      console.error("Error fetching transactions:", error);

      return res.status(500).json({
        message: "Failed to fetch transactions",
      });
    }
  }
}