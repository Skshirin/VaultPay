import { PrismaClient } from "../generated/prisma/client.js";

export class TransactionRepository {
  constructor(private prisma: PrismaClient) {}

  async findByWalletId(walletId: string) {
    return this.prisma.transaction.findMany({
      where: {
        ledgerEntries: {
          some: {
            walletId,
          },
        },
      },
      include: {
        ledgerEntries: {
          where: {
            walletId,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }
}