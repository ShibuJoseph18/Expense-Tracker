import { db } from "../config/db-config.js";
import type {
  CreateAccountRepoInput,
  Account,
} from "../types/account-types.js";
import { ConflictError } from "../utils/errors/conflict-error.js";
import { ServerError } from "../utils/errors/server-error.js";
import { UnauthorizedError } from "../utils/errors/unauthorized-error.js";

export const createAccountRepository = async (
  account: CreateAccountRepoInput
): Promise<Account> => {
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

export const isAccountExisting = async (
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

export const negativeAccountBalance = async (
  userId: number,
  accountId: number,
  amount: number
): Promise<Boolean> => {
  const account = await getAccount(userId, accountId);
  if (!account) {
    throw new UnauthorizedError("Account doesn't exist");
  }
  const newBalance = account.balance - amount;
  if (newBalance < 0) {
    return true;
  }
  return false;
};

export const getAccount = async (
  userId: number,
  accountId: number
): Promise<Account | undefined> => {
  const account = await db.get(
    `
    SELECT * FROM accounts 
    WHERE user_id = $user_id 
    AND id = $id 
    AND deleted = 0
    `,
    {
      $id: accountId,
      $user_id: userId,
    }
  );
  return account;
};

export const updateAccountBalance = async (
  userId: number,
  accountId: number,
  amount: number
): Promise<Account> => {
  const updateBalance = await db.run(
    `UPDATE accounts SET balance = balance + $balance, updated_at = CURRENT_TIMESTAMP WHERE user_id = $user_id AND id = $id AND deleted = 0`,
    {
      $id: accountId,
      $user_id: userId,
      $balance: amount,
    }
  );

  if (!updateBalance.changes)
    throw new ServerError("Account balance updation failed");

  const updatedBalance = await getAccount(userId, accountId);
  return updatedBalance!;
};

export const getAllAccounts = async (userId: number): Promise<Account[]> => {
  const accounts = await db.all(
    `
    SELECT * FROM accounts 
    WHERE user_id = $user_id  
    AND deleted = 0
    `,
    {
      $user_id: userId,
    }
  );

  return accounts;
};
