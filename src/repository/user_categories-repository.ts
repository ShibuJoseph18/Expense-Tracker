import { db } from "../config/db-config.js";
import type { UserCategoryType } from "../types/user_categories-types.js";

export const verifyUserCategories = async (
  userId: number,
  categoryId: number,
  transactionType: "income" | "expense"
): Promise<Boolean> => {
  const userCategories: number | undefined = await db.get(
    `
    SELECT uc.category_id
    FROM user_categories uc
    JOIN categories c ON uc.category_id = c.id
    WHERE uc.category_id = $category_id
      AND uc.user_id = $user_id
      AND c.type = $transaction_type
      AND c.deleted = 0
      AND uc.deleted = 0;
    `,
    {
      $user_id: userId,
      $category_id: categoryId,
      $transaction_type: transactionType,
    }
  );

  return userCategories ? true : false;
};

export const createUserCategory = async (
  userId: number,
  categoryId: number
): Promise<number | undefined> => {
  const insertNewUserCategory = await db.run(
    `
    INSERT INTO user_categories (user_id, category_id)
    VALUES($user_id, $category_id)
    `,
    {
      $user_id: userId,
      $category_id: categoryId,
    }
  );

  if (!insertNewUserCategory.changes || !insertNewUserCategory.lastID) {
    return undefined;
  }
  return insertNewUserCategory.lastID;
};

export const getUserCategory = async (
  userId: number,
  categoryId: number
): Promise<UserCategoryType | undefined> => {
  const userCategory = await db.get(
    `
    SELECT * FROM user_categories 
    WHERE category_id = $category_id 
    AND user_id = $user_id 
    AND deleted = 0
    `,
    {
      $category_id: categoryId,
      $user_id: userId,
    }
  );
  return userCategory;
};
