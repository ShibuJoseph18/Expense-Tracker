import z from "zod";
export const CreateSubCategoryAndUserSubCategorySchema = z.object({
  name: z.string().trim().min(3),
  category_id: z.number(),
});

export type SubcategoryType = {
  id: number;
  name: string;
  category_id: number;
  is_global: 0 | 1;
  deleted: 0 | 1;
  created_at: Date;
  updated_at: Date;
};

export type CreateSubCategoryAndUserSubCategoryServiceInput = Pick<
  SubcategoryType,
  "name" | "category_id"
>;

export type CreateSubCategoryAndUserSubCategoryServiceOutput = Pick<
  SubcategoryType,
  "id" | "name" | "category_id" | "is_global"
>;
