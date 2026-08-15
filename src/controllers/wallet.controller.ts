import { Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware.js";
import {
  depositSchema,
  withdrawSchema
} from "../validators/wallet.validator.js";
import {
  depositMoney,
  getWallet,
  withdrawMoney,
  getWalletTransactions
} from "../services/wallet.service.js";


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
    const result = await depositMoney({
      userId: req.user.userId,
      amount: validationResult.data.amount
    });

    return res.status(200).json({
      message: "Money deposited successfully",

      wallet: {
        id: result.wallet.id,
        balance: result.wallet.balance.toString()
      },

      transaction: {
      id: result.transaction.id,
      amount: result.transaction.amount.toString(),
      status: result.transaction.status,
      createdAt: result.transaction.createdAt
    },

    ledgerEntry: {
      id: result.ledgerEntry.id,
      type: result.ledgerEntry.type,
      amount: result.ledgerEntry.amount.toString(),
      createdAt: result.ledgerEntry.createdAt
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

export async function getWalletBalance(
  req: AuthRequest,
  res: Response
) {
  if (!req.user) {
    return res.status(401).json({
      message: "Authentication required"
    });
  }

  try {
    const wallet = await getWallet(req.user.userId);

    return res.status(200).json({
      wallet: {
        id: wallet.id,
        balance: wallet.balance.toString(),
        createdAt: wallet.createdAt,
        updatedAt: wallet.updatedAt
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

export async function withdraw(
  req: AuthRequest,
  res: Response
) {
  const validationResult = withdrawSchema.safeParse(req.body);

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
    const result = await withdrawMoney({
      userId: req.user.userId,
      amount: validationResult.data.amount
    });

    return res.status(200).json({
      message: "Money withdrawn successfully",

      wallet: {
        id: result.wallet?.id,
        balance: result.wallet?.balance.toString()
      },

      transaction: {
        id: result.transaction.id,
        amount: result.transaction.amount.toString(),
        status: result.transaction.status,
        createdAt: result.transaction.createdAt
      },

      ledgerEntry: {
        id: result.ledgerEntry.id,
        type: result.ledgerEntry.type,
        amount: result.ledgerEntry.amount.toString(),
        createdAt: result.ledgerEntry.createdAt
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

    if (
      error instanceof Error &&
      error.message === "Insufficient balance"
    ) {
      return res.status(400).json({
        message: error.message
      });
    }

    console.error(error);

    return res.status(500).json({
      message: "Internal server error"
    });
  }
}

export async function getTransactions(
  req: AuthRequest,
  res: Response
) {
  if (!req.user) {
    return res.status(401).json({
      message: "Authentication required"
    });
  }

  try {
    const transactions = await getWalletTransactions(
      req.user.userId
    );

    return res.status(200).json({
      transactions: transactions.map((transaction) => ({
        id: transaction.id,
        amount: transaction.amount.toString(),
        status: transaction.status,
        createdAt: transaction.createdAt,

        ledgerEntry: transaction.ledgerEntries[0]
          ? {
              id: transaction.ledgerEntries[0].id,
              type: transaction.ledgerEntries[0].type,
              amount:
                transaction.ledgerEntries[0].amount.toString(),
              createdAt:
                transaction.ledgerEntries[0].createdAt
            }
          : null
      }))
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