import { prisma } from "../config/prisma.js";
import {
  findWalletByUserId,
  depositIntoWallet,
  withdrawFromWallet,
  findTransactionsByWalletId
} from "../repositories/wallet.repository.js";

interface DepositInput {
  userId: string;
  amount: number;
}

interface WithdrawInput {
  userId: string;
  amount: number;
}

export async function depositMoney({
  userId,
  amount
}: DepositInput) {
  const wallet = await findWalletByUserId(userId);

  if (!wallet) {
    throw new Error("Wallet not found");
  }

  if (amount <= 0) {
    throw new Error("Deposit amount must be greater than zero");
  }

  const amountBigInt = BigInt(amount);

  const result = await prisma.$transaction(async (tx) => {
    const updatedWallet = await depositIntoWallet(
      wallet.id,
      amountBigInt,
      tx
    );

    const transaction = await tx.transaction.create({
      data: {
        amount: amountBigInt,
        status: "COMPLETED"
      }
    });

    const ledgerEntry = await tx.ledgerEntry.create({
      data: {
        transactionId: transaction.id,
        walletId: wallet.id,
        type: "CREDIT",
        amount: amountBigInt
      }
    });

    return {
      wallet: updatedWallet,
      transaction,
      ledgerEntry
    };
  });

  return result;
}

export async function getWallet(userId: string) {
  const wallet = await findWalletByUserId(userId);

  if (!wallet) {
    throw new Error("Wallet not found");
  }

  return wallet;
}

export async function withdrawMoney({
  userId,
  amount
}: WithdrawInput) {
  const wallet = await findWalletByUserId(userId);

  if (!wallet) {
    throw new Error("Wallet not found");
  }

  if (amount <= 0) {
    throw new Error("Withdrawal amount must be greater than zero");
  }

  const amountBigInt = BigInt(amount);

  const result = await prisma.$transaction(async (tx) => {
    const updatedCount = await withdrawFromWallet(
      wallet.id,
      amountBigInt,
      tx
    );

    if (updatedCount === 0) {
      throw new Error("Insufficient balance");
    }

    const transaction = await tx.transaction.create({
      data: {
        amount: amountBigInt,
        status: "COMPLETED"
      }
    });

    const ledgerEntry = await tx.ledgerEntry.create({
      data: {
        transactionId: transaction.id,
        walletId: wallet.id,
        type: "DEBIT",
        amount: amountBigInt
      }
    });

    const updatedWallet = await tx.wallet.findUnique({
      where: {
        id: wallet.id
      }
    });

    return {
      wallet: updatedWallet,
      transaction,
      ledgerEntry
    };
  });

  return result;
}

export async function getWalletTransactions(
  userId: string,
  page: number,
  limit: number
) {
  const wallet = await findWalletByUserId(userId);

  if (!wallet) {
    throw new Error("Wallet not found");
  }

  const skip = (page - 1) * limit;

  const result = await findTransactionsByWalletId(
  wallet.id,
  skip,
  limit
);

return {
  transactions: result.transactions,
  pagination: {
    page,
    limit,
    total: result.total,
    totalPages: Math.ceil(result.total / limit)
  }
};
}

interface TransferInput {
  userId: string;
  receiverUserId: string;
  amount: number;
}

export async function transferMoney({
  userId,
  receiverUserId,
  amount
}: TransferInput) {
  if (amount <= 0) {
    throw new Error("Transfer amount must be greater than zero");
  }

  if (userId === receiverUserId) {
    throw new Error("Cannot transfer money to yourself");
  }

  const senderWallet = await findWalletByUserId(userId);
  const receiverWallet = await findWalletByUserId(receiverUserId);

  if (!senderWallet) {
    throw new Error("Sender wallet not found");
  }

  if (!receiverWallet) {
    throw new Error("Receiver wallet not found");
  }

  const amountBigInt = BigInt(amount);

  const result = await prisma.$transaction(async (tx) => {
    const updatedSenderCount = await withdrawFromWallet(
      senderWallet.id,
      amountBigInt,
      tx
    );

    if (updatedSenderCount === 0) {
      throw new Error("Insufficient balance");
    }

    const updatedReceiver = await depositIntoWallet(
      receiverWallet.id,
      amountBigInt,
      tx
    );

    const transaction = await tx.transaction.create({
      data: {
        amount: amountBigInt,
        status: "COMPLETED"
      }
    });

    const debitEntry = await tx.ledgerEntry.create({
      data: {
        transactionId: transaction.id,
        walletId: senderWallet.id,
        type: "DEBIT",
        amount: amountBigInt
      }
    });

    const creditEntry = await tx.ledgerEntry.create({
      data: {
        transactionId: transaction.id,
        walletId: receiverWallet.id,
        type: "CREDIT",
        amount: amountBigInt
      }
    });

    const updatedSender = await tx.wallet.findUnique({
      where: {
        id: senderWallet.id
      }
    });

    return {
      transaction,
      senderWallet: updatedSender,
      receiverWallet: updatedReceiver,
      debitEntry,
      creditEntry
    };
  });

  return result;
}