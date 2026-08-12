import { prisma } from "../config/prisma.js";

export function findWalletByUserId(userId: string) {
  return prisma.wallet.findUnique({
    where: {
      userId
    }
  });
}