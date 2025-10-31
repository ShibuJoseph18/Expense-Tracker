import { db } from "../config/db-config.js";
import type {
  accountRepoInputType,
  accountType,
} from "../types/account-types.js";
import { ConflictError } from "../utils/errors/conflict-error.js";

export const createAccountRepository = async (
  account: accountRepoInputType
): Promise<accountType> => {
  const existingAccount = await isAccountExisting(
    account.user_id,
    account.name,
    account.account_number
  );
  if (existingAccount) {
    throw new ConflictError("Account already exists", 409);
  }

  const newAccountInsert = await db.run(
    `INSERT INTO accounts (user_id, name, bank_name, account_number, balance, initial_deposit) 
     VALUES($user_id, $name, $bank_name, $account_number, $balance, $initial_deposit)`,
    {
      $user_id: account.user_id,
      $name: account.name,
      $bank_name: account.bank_name,
      $account_number: account.account_number,
      $balance: account.balance,
      $initial_deposit: account.initial_deposit,
    }
  );

  const newAccount = await db.get(`SELECT * FROM accounts WHERE id = $id`, {
    $id: newAccountInsert.lastID,
  });

  return newAccount;
};

const isAccountExisting = async (
  userId: number,
  name: string,
  accountNumber?: string
): Promise<boolean> => {
  const account = await db.get(
    `SELECT EXISTS(
     SELECT 1 FROM accounts 
     WHERE (user_id = $userId AND name = $name)
        OR account_number = $accountNumber
   ) AS account_exists;`,
    {
      $userId: userId,
      $name: name,
      $accountNumber: accountNumber,
    }
  );

  if (account.account_exists) return true;
  return false;
};
