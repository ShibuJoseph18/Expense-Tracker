import { db } from "../config/db-config.js";
import type { UserSubCategory } from "../types/user_subcategories-types.js";

export const verifyUserSubCategories = async (
  userId: number,
  categoryId: number,
  subcategoryId: number
): Promise<Boolean> => {
  const userSubcategories: number | undefined = await db.get(
    `
    SELECT usc.id
    FROM user_subcategories usc
    JOIN subcategories sc ON usc.subcategory_id = sc.id
    WHERE usc.user_id = $user_id
      AND usc.deleted = 0
      AND usc.subcategory_id = $subcategory_id
      AND sc.category_id = $category_id;
    `,
    {
      $user_id: userId,
      $category_id: categoryId,
      $subcategory_id: subcategoryId,
    }
  );

  return userSubcategories ? true : false;
};

export const createUserSubCategory = async (
  userId: number,
  SubCategoryId: number
): Promise<number | undefined> => {
  const insertUserSubCategory = await db.run(
    `
    INSERT INTO user_subcategories (user_id, subcategory_id)
    VALUES($user_id, $subcategory_id)
    `,
    {
      $user_id: userId,
      $subcategory_id: SubCategoryId,
    }
  );

  if (!insertUserSubCategory.changes || !insertUserSubCategory.lastID) {
    return undefined;
  }

  return insertUserSubCategory.lastID;
};

export const getUserSubCategoryById = async (
  userSubCategoryId: number,
  userId: number
): Promise<UserSubCategory | undefined> => {
  const userSubCategory = await db.get(
    `
    SELECT * FROM user_subcategories 
    WHERE id = $id 
    AND user_id = $user_id 
    AND deleted = 0
    `,
    {
      $id: userSubCategoryId,
      $user_id: userId,
    }
  );

  return userSubCategory;
};

