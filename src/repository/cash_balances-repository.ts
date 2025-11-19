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

export const initialDepositCash = async (userId: number, amount: number) => {
  console.log("user", userId);
  const alreadyDeposited = await db.get(
    `SELECT initial_deposit FROM cash_balances WHERE user_id = $user_id`,
    {
      $user_id: userId,
    }
  );

  if (alreadyDeposited && alreadyDeposited.initial_deposit) {
    return false;
  }

  await db.run(
    `INSERT INTO cash_balances 
    (user_id, balance, initial_deposit) 
    VALUES($user_id, $balance, $initial_deposit)`,
    {
      $user_id: userId,
      $initial_deposit: 1,
      $balance: amount,
    }
  );

  return true;
};
