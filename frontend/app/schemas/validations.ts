import { z } from "zod";


export const swapRequestSchema = z.object({
    inputMint: z.string().min(32).max(44),
    outputMint: z.string().min(32).max(44),
    amount: z.string().regex(/^\d+(\.\d+)?$/, "Amount must be a valid positive number"),
    slippage: z.string(),
});