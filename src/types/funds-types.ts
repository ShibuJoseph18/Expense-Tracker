import z from "zod";

export const createFundSchema = z.object({
  name: z.string().trim().min(2),
  amount: z.number(),
  category_id: z.number(),
  subcategory_id: z.number().optional(),
});

export const updateFundSchema = z.object({
  name: z.string().trim().min(2).optional(),
  amount: z.number().optional(),
});

export const getFundSchema = z.object({
  account_id: z.number(),
});

export type Fund = {
  id: number;
  name: string;
  user_id: number;
  amount: number;
  category_id: number;
  subcategory_id: number;
  created_at: Date;
  updated_at: Date;
  deleted: 0 | 1;
};

export type CreateFundRepoInput = Pick<
  Fund,
  "user_id" | "name" | "amount" | "category_id"
> &
  Partial<Pick<Fund, "subcategory_id">>;

export type CreateFundServiceInput = CreateFundRepoInput;

export type CreateFundServiceOutput = Pick<
  Fund,
  "id" | "user_id" | "name" | "amount" | "category_id" | "subcategory_id"
>;

export type GetFund = Pick<Fund, "id" | "user_id">;

export type GetFundByUserIdAndNameInput = Pick<Fund, "name" | "user_id">;

export type UpdateFundRepoInput = Pick<Fund, "id" | "user_id"> &
  Partial<Pick<Fund, "name" | "amount">>;

export type UpdateFundServiceInput = Pick<Fund, "id" | "user_id"> &
  Partial<Pick<Fund, "name" | "amount">>;

export type UpdateFundServiceOutput = Pick<
  Fund,
  "id" | "user_id" | "name" | "amount" | "category_id" | "subcategory_id"
>;
