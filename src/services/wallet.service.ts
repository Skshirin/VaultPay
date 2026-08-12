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

  const updatedWallet = await prisma.wallet.update({
    where: {
      id: wallet.id
    },
    data: {
      balance: {
        increment: amount
      }
    }
  });

  return updatedWallet;
}