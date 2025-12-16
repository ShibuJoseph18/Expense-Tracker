import z from "zod";

export const accountUserInputSchema = z.object({
  name: z.string(),
  bank_name: z.string().optional(),
  account_number: z.string().optional(),
  balance: z.number().optional(),
});

export const initialAccountDepositSchema = z.object({
  account_id: z.number().min(1),
  amount: z.number().min(1),
});

export type Account = {
  id: number;
  user_id: number;
  name: string;
  bank_name: string;
  account_number: string;
  balance: number;
  initial_deposit: 0 | 1;
  created_at: Date;
  updated_at: Date;
};

export type CreateAccountServiceInput = Pick<
  Account,
  "name" | "bank_name" | "account_number" | "balance"
>;

export type CreateAccountServiceOutput = Pick<
  Account,
  "user_id" | "name" | "bank_name" | "account_number" | "balance"
>;

export type CreateAccountRepoInput = Pick<
  Account,
  | "user_id"
  | "name"
  | "bank_name"
  | "account_number"
  | "balance"
  | "initial_deposit"
>;

export type InitialAccountDepositServiceType = {
  account_id: number;
  amount: number;
};

