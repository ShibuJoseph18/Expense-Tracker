import {
  createAccountRepository,
  initialDepositAccountRepository,
  getAccount,
  getAllAccounts,
} from "../repository/account-repository.js";
import type {
  CreateAccountServiceInput,
  CreateAccountServiceOutput,
  GetAccountServiceInput,
  GetAccountServiceOutput,
} from "../types/account-types.js";
import { ConflictError } from "../utils/errors/conflict-error.js";
import type { InitialAccountDepositServiceType } from "../types/account-types.js";
import { ServerError } from "../utils/errors/server-error.js";
import { omitAuditFields } from "../utils/helpers/response-helper.js";
import { UnauthorizedError } from "../utils/errors/unauthorized-error.js";

export const createAccountService = async (
  userId: number,
  accountServiceInput: CreateAccountServiceInput
): Promise<CreateAccountServiceOutput> => {
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

export const initialAccountDepositService = async (
  userId: number,
  accDesposit: InitialAccountDepositServiceType
) => {
  const accountDeposit = await initialDepositAccountRepository(
    userId,
    accDesposit.account_id,
    accDesposit.amount
  );

  if (!accountDeposit) {
    throw new ConflictError("Initial account deposit already exists");
  }

  return "Deposit Success";
};

export const getAccountService = async (
  userId: number,
  accountServiceInput: GetAccountServiceInput
): Promise<GetAccountServiceOutput> => {
  const account = await getAccount(userId, accountServiceInput.account_id);
  if (!account) {
    throw new UnauthorizedError("Account doesn't exist");
  }

  const accountServiceOutput = omitAuditFields(account);
  return accountServiceOutput as GetAccountServiceOutput;
};

export const getAllAccountsService = async (
  userId: number
): Promise<GetAccountServiceOutput[]> => {
  const accounts = await getAllAccounts(userId);
  const accountServiceOutput = accounts.map((account) =>
    omitAuditFields(account)
  );

  return accountServiceOutput as GetAccountServiceOutput[];
};
