import { db } from "../config/db-config.js";

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

