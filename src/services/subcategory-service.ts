import { getCategoryById } from "../repository/categories-repository.js";
import { ServerError } from "../utils/errors/server-error.js";
import { atomicTransaction } from "../utils/helpers/transaction-helper.js";
import type {
  CreateSubCategoryAndUserSubCategoryServiceInput,
  CreateSubCategoryAndUserSubCategoryServiceOutput,
} from "../types/subcategory-types.js";
import { omitAuditFields } from "../utils/helpers/response-helper.js";
import {
  createNonGlobalSubCategory,
  getSubCategoryById,
} from "../repository/subcategories-repository.js";
import { createUserSubCategory } from "../repository/user_subcategories-repository.js";
import { getUserCategory } from "../repository/user_categories-repository.js";
export const createSubCategoryAndUserSubCategoryService = async (
  userId: number,
  subCategoryServiceInput: CreateSubCategoryAndUserSubCategoryServiceInput
): Promise<CreateSubCategoryAndUserSubCategoryServiceOutput> => {
  const validCategory = await getUserCategory(
    userId,
    subCategoryServiceInput.category_id
  );
  if (!validCategory) {
    throw new ServerError("Category doesn't belong to user");
  }
  const newSubCategory = await atomicTransaction(async () => {
    // Create new sub-category
    const newSubCategoryId = await createNonGlobalSubCategory(
      subCategoryServiceInput.name,
      subCategoryServiceInput.category_id
    );
    if (!newSubCategoryId) {
      throw new ServerError("Subcategory creation failed");
    }

    // Create new user sub-category
    const newUserSubCategoryId = await createUserSubCategory(
      userId,
      newSubCategoryId
    );
    if (!newUserSubCategoryId) {
      throw new ServerError("User Subcategory creation failed");
    }

    // Fetch sub-category
    const subCategory = await getSubCategoryById(newSubCategoryId);

    return subCategory;
  });

  const subCategory = omitAuditFields(
    newSubCategory
  ) as CreateSubCategoryAndUserSubCategoryServiceOutput;

  return subCategory;
};
