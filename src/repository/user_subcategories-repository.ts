import { db } from "../config/db-config.js";

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

