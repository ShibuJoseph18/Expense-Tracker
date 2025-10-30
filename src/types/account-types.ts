import * as z from "zod";

export const accountSchema = z.object({
  name: z.string(),
  bankName: z.string().optional(),
  accountNumber: z.string().optional(),
  balance: z.number().optional(),
});

export type accountType = z.infer<typeof accountSchema> & {
  initialDeposit?: number;
};