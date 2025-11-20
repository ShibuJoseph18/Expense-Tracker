import { db } from "../config/db-config.js";

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
