import { db } from "../config/db-config.js";

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