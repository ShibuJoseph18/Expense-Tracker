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

export const getTransactionSchema = z.object({
  transaction_type: z.enum(["expense", "income"]).optional(),
  entity: z.enum(["cash", "account"]).optional(),
  offset: z.coerce.number().int().min(0).default(0),
  limit: z.coerce.number().int().min(1).max(100).default(10),
});

export type Transaction = {
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
  Transaction,
  "type" | "amount" | "is_cash" | "account_id" | "category_id"
> &
  Partial<Pick<Transaction, "subcategory_id" | "note" | "date">>;

export type CreateTransactionRepoInput = Pick<
  Transaction,
  "user_id" | "type" | "amount" | "is_cash" | "category_id" | "date"
> & {
  // > //   "id" | "created_at" | "updated_at" | "deleted" | "subcategory_id" | "note" //   TransactionType, // Omit<
  subcategory_id: number | null;
  note: string | null;
  account_id: number | null;
};

export type GetTransactionServiceInput = {
  transaction_type?: "expense" | "income" | undefined;
  entity?: "cash" | "account" | undefined;
  offset?: number;
  limit?: number;
};

export type GetTransactionServiceOutput = {
  filters: {
    transaction_type?: "expense" | "income" | undefined;
    entity?: "cash" | "account" | undefined;
    offset?: number | undefined;
    limit?: number | undefined;
  };
  transaction: {
    count_of_transactions: number;
    transactions: Omit<Transaction, "created_at" | "updated_at" | "deleted">[];
  };
};

export type GetTransactionRepositoryInput = {
  transactionType?: "expense" | "income" | undefined;
  entity?: "cash" | "account" | undefined;
  offset?: number | undefined;
  limit?: number | undefined;
};
