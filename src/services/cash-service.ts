import { db } from "../config/db-config.js";

export const intializeCashBalanceService = async (
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
