import { z } from "zod";

export const depositSchema = z.object({
  amount: z.number().int().positive()
});

export const withdrawSchema = z.object({
  amount: z.number().int().positive()
});