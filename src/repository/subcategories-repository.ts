import { db } from "../config/db-config.js";
import type { SubcategoryType } from "../types/subcategory-types.js";
export const intializeDefaultSubCategories = async (
  userId: number
): Promise<boolean> => {
  try {
    const insertedSubCategories = await db.run(
      `INSERT INTO user_subcategories (user_id, subcategory_id)
     SELECT $userId, id
     FROM subcategories
     WHERE is_global = 1`,
      { $userId: userId }
    );
    if (insertedSubCategories.changes && insertedSubCategories.changes > 0) {
      return true;
    }
    return false;
  } catch (error) {
    return false;
  }
};

export const createNonGlobalSubCategory = async (
  name: string,
  categoryId: number
): Promise<number | undefined> => {
  const insertSubCategory = await db.run(
    `
    INSERT INTO subcategories (name, category_id, is_global)
    VALUES($name, $category_id, $is_global)
    `,
    {
      $name: name,
      $category_id: categoryId,
      $is_global: 0,
    }
  );

  if (!insertSubCategory.changes || !insertSubCategory.lastID) {
    return undefined;
  }

  return insertSubCategory.lastID;
};

export const getSubCategoryById = async (
  subCategoryId: number
): Promise<SubcategoryType | undefined> => {
  const subCategory = await db.get(
    `
    SELECT * FROM subcategories WHERE id = $id AND deleted = 0
    `,
    {
      $id: subCategoryId,
    }
  );

  return subCategory;

};
