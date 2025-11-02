import { db } from "../config/db-config.js";
import { createAccountRepository } from "../repository/account.repository.js";
import type {
  accountServiceInputType,
  accountServiceOutputType,
} from "../types/account-types.js";
import { ConflictError } from "../utils/errors/conflict-error.js";

export const createAccountService = async (
  userId: number,
  accountServiceInput: accountServiceInputType
): Promise<accountServiceOutputType> => {
  const accountRepoInput = {
    ...accountServiceInput,
    user_id: userId,
    balance: accountServiceInput.balance || 0,
    initial_deposit: (accountServiceInput.balance ? 1 : 0) as 0 | 1,
  };
  const accountRepoOutput = await createAccountRepository(accountRepoInput);
  const { created_at, updated_at, ...accountServiceOutput } = accountRepoOutput;

  return accountServiceOutput;
};
