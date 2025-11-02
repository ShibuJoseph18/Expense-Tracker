import * as z from "zod";

export const transactionSchema = z.object({
  type: z.enum(["expense", "income"]),
  amount: z.number(),
  is_cash: z.union([z.literal(0), z.literal(1)]),
  account_id: z.number(),
  category_id: z.number(),
  subcategory_id: z.number().optional(),
  note: z.string().optional(),
  date: z.date().optional().nullable(),
});

export type transactionType = {
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

export type transactionServiceInputType = Omit<
  transactionType,
  "id" | "user_id" | "created_at" | "updated_at" | "deleted"
> &
  Partial<Pick<transactionType, "subcategory_id" | "note" | "date">>;

export type transactionServiceOutputType = Omit<
  transactionType,
  "created_at" | "updated_at"
> & {
  subcategory_id: number | null;
  note: string | null;
};

export type transactionRepoInputType = Omit<
  transactionType,
  "id" | "created_at" | "updated_at" | "deleted" | "subcategory_id" | "note"
> & {
  subcategory_id: number | null;
  note: string | null;
};
