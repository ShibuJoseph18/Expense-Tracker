import { db } from "../config/db-config.js";

export const intializeDefaultCategoriesService = async (userId: number) => {
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
