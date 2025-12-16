export type UserSubCategory = {
  id: number;
  category_id: number;
  name: string;
  is_global: 0 | 1;
  deleted: 0 | 1;
  created_at: Date;
  updated_at: Date;
};
