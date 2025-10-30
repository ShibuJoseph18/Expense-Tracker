import { db } from "../config/db-config.js";
import type { accountType } from "../types/account-types.js";
import { ConflictError } from "../utils/errors/conflict-error.js";

export const createAccountService = async (
  userId: number,
  accountPayload: accountType
) => {
  const newAccountInsert = await db.run(
    `INSERT OR IGNORE INTO accounts (user_id, name, bank_name, account_number, balance, initial_deposit) 
     VALUES($user_id, $name, $bank_name, $account_number, $balance, $initial_deposit)`,
    {
      $user_id: userId,
      $name: accountPayload.name,
      $bank_name: accountPayload.bankName,
      $account_number: accountPayload.accountNumber,
      $balance: accountPayload.balance || 0,
      $initial_deposit: accountPayload.balance ? 1 : 0,
    }
  );

  if (newAccountInsert.changes === 0) {
    throw new ConflictError("Account already exists", 409);
  }

  const newAccount = await db.get(`SELECT * FROM accounts WHERE id = $id`, {
    $id: newAccountInsert.lastID,
  });

  return newAccount;
};
