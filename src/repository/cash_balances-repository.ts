import { db } from "../config/db-config.js";
import { ServerError } from "../utils/errors/server-error.js";
import type { CashBalanceType } from "../types/cash_balance-types.js";

export const intializeCashBalance = async (
  userId: number
): Promise<boolean> => {
  try {
    const initializeCashBalance = await db.run(
      `INSERT INTO cash_balances (user_id) VALUES ($userId)`,
      {
        $userId: userId,
      }
    );
    if (initializeCashBalance.changes && initializeCashBalance.changes > 0) {
      return true;
    }

    return false;
  } catch (err) {
    return false;
  }
};

export const initialDepositCashRepository = async (
  userId: number,
  amount: number
): Promise<Boolean> => {
  const alreadyDeposited = await db.get(
    `SELECT initial_deposit FROM cash_balances WHERE user_id = $user_id`,
    {
      $user_id: userId,
    }
  );

  if (alreadyDeposited.initial_deposit) {
    return false;
  }

  await db.run(
    `UPDATE cash_balances 
    SET balance = $balance, initial_deposit = $initial_deposit
    WHERE user_id = $user_id`,
    {
      $user_id: userId,
      $initial_deposit: 1,
      $balance: amount,
    }
  );

  return true;
};

export const getCashBalance = async (
  userId: number
): Promise<CashBalanceType> => {
  const balance = await db.get(
    `SELECT * FROM cash_balances WHERE user_id = $user_id AND deleted = 0`,
    {
      $user_id: userId,
    }
  );
  return balance;
};

export const updateCashBalance = async (
  userId: number,
  amount: number
): Promise<CashBalanceType> => {
  const updateBalance = await db.run(
    `
    UPDATE cash_balances
    SET balance = balance + $balance, updated_at = CURRENT_TIMESTAMP
    WHERE user_id = $user_id AND deleted = 0
    `,
    {
      $user_id: userId,
      $balance: amount,
    }
  );

  if (!updateBalance.changes) {
    throw new ServerError("Cash balance update failed");
  }

  const updatedBalance = await getCashBalance(userId);
  return updatedBalance;
};

export const negativeCashBalance = async (
  userId: number,
  amount: number
): Promise<Boolean> => {
  const balance = await db.get(
    `SELECT balance FROM cash_balances WHERE user_id = $user_id`,
    {
      $user_id: userId,
    }
  );

  const newBalance = balance.balance - amount;
  if (newBalance < 0) {
    return true;
  }
  return false;
};
