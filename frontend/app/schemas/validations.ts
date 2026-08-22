import { z } from "zod";

import { isAddress } from "@solana/kit";

export const swapRequestSchema = z.object({
    inputMint: z.string().min(32).max(44),
    outputMint: z.string().min(32).max(44),
    amount: z.string().regex(/^\d+(\.\d+)?$/, "Amount must be a valid positive number"),
    slippage: z.string(),
});




const solanaAddress = z.string().refine(isAddress, {
  message: "Invalid Solana address",
});

const positiveAmount = z.string()
  .regex(/^\d+(\.\d+)?$/, "Amount must be a valid number")
  .refine((value) => Number(value) > 0, {
    message: "Amount must be greater than 0",
  });

export const sendRequestSchema = z.object({
  publicKey: solanaAddress,
  address: solanaAddress,
  amount: positiveAmount,
  tokenMint: solanaAddress,
});