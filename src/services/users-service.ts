import { getUserById } from "../repository/user-repository.js";
import { UnauthorizedError } from "../utils/errors/unauthorized-error.js";
import type { GetUserServiceOutput } from "../types/user-types.js";
import { omitAuditFields } from "../utils/helpers/response-helper.js";

export const getUserService = async (
  userId: number
): Promise<GetUserServiceOutput> => {
  const user = await getUserById(userId);
  if (!user) {
    throw new UnauthorizedError("User doesn't exist ");
  }
  const getUserServiceOutput = omitAuditFields(user, ["password"]);
  return getUserServiceOutput as GetUserServiceOutput;
};
