import { prisma } from "../config/prisma.js";
import { findWalletByUserId } from "../repositories/wallet.repository.js";

interface DepositInput {
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