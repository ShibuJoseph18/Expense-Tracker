import {
  createFundRepo,
  getFund,
  getFundByUserIdAndName,
  updateFundRepo,
} from "../repository/funds-repository.js";
import { verifyUserCategoriesWithoutTrasactionType } from "../repository/user_categories-repository.js";
import { verifyUserSubCategories } from "../repository/user_subcategories-repository.js";
import type {
  CreateFundServiceInput,
  CreateFundServiceOutput,
  UpdateFundServiceInput,
  UpdateFundServiceOutput,
} from "../types/funds-types.js";
import { ConflictError } from "../utils/errors/conflict-error.js";
import { ServerError } from "../utils/errors/server-error.js";
import { UnauthorizedError } from "../utils/errors/unauthorized-error.js";
import { omitAuditFields } from "../utils/helpers/response-helper.js";
import { pendoTrack } from "../utils/pendo-track.js";

export const createFundService = async (
  fundServiceInput: CreateFundServiceInput
) => {
  // Verify category belongs to user
  if (
    !(await verifyUserCategoriesWithoutTrasactionType(
      fundServiceInput.user_id,
      fundServiceInput.category_id
    ))
  ) {
    throw new UnauthorizedError("User doesn't have access to this category");
  }

  // Verify sub-category belongs to user and sub-category matches category
  if (
    fundServiceInput.subcategory_id !== undefined &&
    !(await verifyUserSubCategories(
      fundServiceInput.user_id,
      fundServiceInput.category_id,
      fundServiceInput.subcategory_id
    ))
  ) {
    throw new UnauthorizedError("Subcategory doesn't belong to category");
  }

  // Prohibit fund creation if fund with same name exists
  const existingFund = await getFundByUserIdAndName({
    name: fundServiceInput.name,
    user_id: fundServiceInput.user_id,
  });
  if (existingFund) {
    throw new ConflictError(
      `Fund named ${fundServiceInput.name} already exists`
    );
  }

  const newFundId = await createFundRepo({
    ...fundServiceInput,
  });
  if (!newFundId) {
    throw new ServerError();
  }

  const newFund = await getFund({
    id: newFundId,
    user_id: fundServiceInput.user_id,
  });

  const createFundServiceOutput = omitAuditFields(newFund);

  pendoTrack("fund_created", String(fundServiceInput.user_id), {
    fund_id: newFundId,
    fund_name: fundServiceInput.name,
    fund_amount: fundServiceInput.amount,
    category_id: fundServiceInput.category_id,
    has_subcategory: fundServiceInput.subcategory_id !== undefined,
  });

  return createFundServiceOutput;
};

export const updateFundService = async (
  fundServiceInput: UpdateFundServiceInput
): Promise<UpdateFundServiceOutput> => {
  // Prohibit fund name updation, if fund with same name exists
  const existingFund = await getFund({
    id: fundServiceInput.id,
    user_id: fundServiceInput.user_id,
  });
  if (existingFund && existingFund.name === fundServiceInput.name) {
    throw new ConflictError(
      `Fund named ${fundServiceInput.name} already exists, fund name cannot be updated`
    );
  }

  const updateFund = await updateFundRepo({
    ...fundServiceInput,
  });
  if (!updateFund) {
    throw new UnauthorizedError("Fund doesn't exist");
  }

  const fund = await getFund({
    id: fundServiceInput.id,
    user_id: fundServiceInput.user_id,
  });

  const fundServiceOutput = omitAuditFields(fund);

  pendoTrack("fund_updated", String(fundServiceInput.user_id), {
    fund_id: fundServiceInput.id,
    name_changed: fundServiceInput.name !== undefined,
    amount_changed: fundServiceInput.amount !== undefined,
    amount_delta: fundServiceInput.amount || 0,
  });

  return fundServiceOutput as UpdateFundServiceOutput;
};
