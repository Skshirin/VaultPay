import { Router } from "express";
import { prisma } from "../config/prisma.js"
import { TransactionRepository } from "../repositories/transaction.repository.js";
import { TransactionService } from "../services/transaction.service.js";
import { TransactionController } from "../controllers/transaction.controller.js";

const router = Router();

const transactionRepository = new TransactionRepository(prisma);
const transactionService = new TransactionService(transactionRepository);
const transactionController = new TransactionController(transactionService);

router.get(
  "/:walletId",
  transactionController.getTransactions.bind(transactionController)
);

export default router;