import { z } from "zod";

export const depositSchema = z.object({
  amount: z.number().int().positive()
});

export const withdrawSchema = z.object({
  amount: z.number().int().positive()
});

export const transactionPaginationSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(50).default(10)
});