import z from "zod";

export const createCategoryAndUserCategorySchema = z.object({
  name: z.string(),
  type: z.enum(["expense", "income"]),
});

export type CategoryType = {
  id: number;
  name: string;
  type: "expense" | "income";
  is_global: 0 | 1;
  deleted: 0 | 1;
  created_at: Date;
  updated_at: Date;
};

export type CreateCategoryAndUserCategoryServiceInput = Pick<
  CategoryType,
  "name" | "type"
>;

export type CreateCategoryAndUserCategoryServiceOutput = Pick<
  CategoryType,
  "id" | "name" | "type" | "is_global"
>;
