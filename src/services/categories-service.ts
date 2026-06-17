import {
  createNonGlobalCategory,
  getCategoryById,
} from "../repository/categories-repository.js";
import { createUserCategory } from "../repository/user_categories-repository.js";
import { ServerError } from "../utils/errors/server-error.js";
import { atomicTransaction } from "../utils/helpers/transaction-helper.js";
import type {
  CreateCategoryAndUserCategoryServiceInput,
  CreateCategoryAndUserCategoryServiceOutput,
} from "../types/category-types.js";
import { omitAuditFields } from "../utils/helpers/response-helper.js";
import { pendoTrack } from "../utils/pendo-track.js";

export const createCategoryAndUserCategoryService = async (
  userId: number,
  categoryServiceInput: CreateCategoryAndUserCategoryServiceInput
): Promise<CreateCategoryAndUserCategoryServiceOutput> => {
  const newCategory = await atomicTransaction(async () => {
    // Create new category
    const newCategoryId = await createNonGlobalCategory(
      categoryServiceInput.name,
      categoryServiceInput.type
    );
    if (!newCategoryId) {
      throw new ServerError("Category creation failed");
    }

    // Create new user category
    const newUserCategoryId = await createUserCategory(userId, newCategoryId);
    if (!newUserCategoryId) {
      throw new ServerError("User category creation failed");
    }

    // Fetch category
    const category = await getCategoryById(newCategoryId);
    if (!category) {
      throw new ServerError("Category creation failed");
    }

    return category;
  });

  const category = omitAuditFields(
    newCategory
  ) as CreateCategoryAndUserCategoryServiceOutput;

  pendoTrack("category_created", String(userId), {
    category_id: category.id,
    category_name: category.name,
    category_type: category.type,
  });

  return category;
};
