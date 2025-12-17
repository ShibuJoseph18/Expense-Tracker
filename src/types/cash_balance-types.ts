import z from "zod";
export type CashBalance = {
  id: number;
  user_id: number;
  initial_deposit: 0 | 1;
  balance: number;
  deleted: 0 | 1;
  created_at: Date;
  updated_at: Date;
};

export type InitialCashDepositService = {
  amount: number;
};

export const initialCashDepositSchema = z.object({
  amount: z.number().min(1),
});

export type GetCashBalanceServiceOutput = Pick<
  CashBalance,
  "id" | "user_id" | "initial_deposit" | "balance"
>;
