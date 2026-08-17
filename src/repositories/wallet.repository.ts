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
  const [transactions, total] = await Promise.all([
    prisma.transaction.findMany({
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
    }),

    prisma.transaction.count({
      where: {
        ledgerEntries: {
          some: {
            walletId
          }
        }
      }
    })
  ]);

  return {
    transactions,
    total
  };
}

export async function depositIntoWallet(
  walletId: string,
  amount: bigint,
  tx: PrismaTransactionClient
) {
  return tx.wallet.update({
    where: {
      id: walletId
    },
    data: {
      balance: {
        increment: amount
      }
    }
  });
}