import * as z from "zod";

export const cashTransactionSchema = z.object({
  type: z.enum(["expense", "income"]),
  amount: z.number(),
  is_cash: z.literal(1),
  category_id: z.number(),
  subcategory_id: z.number().optional(),
  note: z.string().optional(),
  date: z.date().optional().nullable(),
});

export const accountTransactionSchema = z.object({
  type: z.enum(["expense", "income"]),
  amount: z.number(),
  is_cash: z.literal(0),
  account_id: z.number(),
  category_id: z.number(),
  subcategory_id: z.number().optional(),
  note: z.string().optional(),
  date: z.date().optional().nullable(),
});

export const transactionSchema = z.discriminatedUnion("is_cash", [
  accountTransactionSchema,
  cashTransactionSchema,
]);

export type TransactionType = {
  id: number;
  user_id: number;
  type: "expense" | "income";
  amount: number;
  is_cash: 0 | 1;
  account_id: number;
  category_id: number;
  subcategory_id: number;
  note: string;
  date: Date;
  created_at: Date;
  updated_at: Date;
  deleted: 0 | 1;
};

export type CreateTransactionServiceInput = Pick<
  TransactionType,
  "type" | "amount" | "is_cash" | "account_id" | "category_id"
> &
  Partial<Pick<TransactionType, "subcategory_id" | "note" | "date">>;

export type transactionServiceOutputType = Omit<
  TransactionType,
  "created_at" | "updated_at"
> & {
  subcategory_id: number | null;
  note: string | null;
};

export type CreateTransactionRepoInput = Pick<
  TransactionType,
  "user_id" | "type" | "amount" | "is_cash" | "category_id" | "date"
> & {
  // > //   "id" | "created_at" | "updated_at" | "deleted" | "subcategory_id" | "note" //   TransactionType, // Omit<
  subcategory_id: number | null;
  note: string | null;
  account_id: number | null;
};

export type CreateCashTransactionRepoInput = Pick<
  TransactionType,
  "user_id" | "type" | "amount" | "is_cash" | "category_id"
> & {
  subcategory_id?: number | null;
  note?: string | null;
  date?: Date | null;
};
