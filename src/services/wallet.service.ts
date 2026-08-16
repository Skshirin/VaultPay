import { prisma } from "../config/prisma.js";
import { findWalletByUserId, withdrawFromWallet,findTransactionsByWalletId} from "../repositories/wallet.repository.js";

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

  const result = await prisma.$transaction(async (tx) => {
    const updatedWallet = await tx.wallet.update({
      where: {
        id: wallet.id
      },
      data: {
        balance: {
          increment: BigInt(amount)
        }
      }
    });

    const transaction = await tx.transaction.create({
      data: {
        amount: BigInt(amount),
        status: "COMPLETED"
      }
    });

    const ledgerEntry = await tx.ledgerEntry.create({
      data: {
        transactionId: transaction.id,
        walletId: wallet.id,
        type: "CREDIT",
        amount: BigInt(amount)
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

  const transactions = await findTransactionsByWalletId(
    wallet.id,
    skip,
    limit
  );

  return transactions;
}