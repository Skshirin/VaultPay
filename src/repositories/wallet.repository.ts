import { prisma } from "../config/prisma.js";

export function findWalletByUserId(userId: string) {
  return prisma.wallet.findUnique({
    where: {
      userId
    }
  });
}

type PrismaTransactionClient = Parameters<
  Parameters<typeof prisma.$transaction>[0]
>[0];

export async function withdrawFromWallet(
  walletId: string,
  amount: bigint,
  tx: PrismaTransactionClient
) {
  const result = await tx.wallet.updateMany({
    where: {
      id: walletId,
      balance: {
        gte: amount
      }
    },
    data: {
      balance: {
        decrement: amount
      }
    }
  });

  return result.count;
}

export async function findTransactionsByWalletId(
  walletId: string,
  skip: number,
  limit: number
) {
  return prisma.transaction.findMany({
    where: {
      ledgerEntries: {
        some: {
          walletId
        }
      }
    },

    include: {
      ledgerEntries: {
        where: {
          walletId
        }
      }
    },

    orderBy: {
      createdAt: "desc"
    },

    skip,
    take: limit
  });
}