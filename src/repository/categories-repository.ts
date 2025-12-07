import { db } from "../config/db-config.js";
import type { CategoryType } from "../types/category-types.js";

export const intializeDefaultCategories = async (userId: number) => {
  try {
    const insertedCategories = await db.run(
      `INSERT INTO user_categories (user_id, category_id)
     SELECT $userId, id
     FROM categories
     WHERE is_global = 1`,
      { $userId: userId }
    );
    if (insertedCategories.changes && insertedCategories.changes > 0) {
      return true;
    }
    return false;
  } catch (error) {
    return false;
  }
};

export const createNonGlobalCategory = async (
  name: string,
  type: "expense" | "income"
): Promise<number | undefined> => {
  const insertNewCategory = await db.run(
    `
    INSERT INTO categories (name, type, is_global)
    VALUES($name, $type, $is_global)
    `,
    {
      $name: name,
      $type: type,
      $is_global: 0,
    }
  );

  if (!insertNewCategory.changes || !insertNewCategory.lastID) {
    return undefined;
  }
  return insertNewCategory.lastID;
};

export const getCategoryById = async (
  categoryId: number
): Promise<CategoryType | undefined> => {
  const category = await db.get(
    `
    SELECT * FROM categories WHERE id = $id AND deleted = 0
    `,
    {
      $id: categoryId,
    }
  );
  return category;
};
