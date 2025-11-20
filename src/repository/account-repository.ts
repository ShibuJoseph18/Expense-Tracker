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

export const initialDepositAccountRepository = async (
  userId: number,
  accountId: number,
  amount: number
): Promise<Boolean> => {
  const alreadyDeposited = await db.get(
    `SELECT initial_deposit FROM accounts WHERE user_id = $user_id AND id = $id`,
    {
      $user_id: userId,
      $id: accountId,
    }
  );

  if (alreadyDeposited && alreadyDeposited.initial_deposit) {
    return false;
  }

  await db.run(
    `UPDATE accounts 
    SET balance = $balance, initial_deposit = $initial_deposit
    WHERE id = $id AND user_id = $user_id `,
    {
      $id: accountId,
      $user_id: userId,
      $balance: amount,
      $initial_deposit: 1,
    }
  );

  return true;
};
