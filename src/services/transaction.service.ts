import { TransactionRepository } from "../repositories/transaction.repository.js";

export class TransactionService {
  constructor(private transactionRepository: TransactionRepository) {}

  async getTransactions(walletId: string) {
    return this.transactionRepository.findByWalletId(walletId);
  }
}