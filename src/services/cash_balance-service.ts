import { db } from "../config/db-config.js";
import { initialDepositCashRepository } from "../repository/cash_balances-repository.js";
import { ConflictError } from "../utils/errors/conflict-error.js";
import { ServerError } from "../utils/errors/server-error.js";
import type { InitialCashDepositServiceType } from "../types/cash_balance-types.js";
initialDepositCashRepository;

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

export const initialCashDepositService = async (
  userId: number,
  initialDepositInput: InitialCashDepositServiceType
) => {
  const { amount } = initialDepositInput;
  const cashDeposit = await initialDepositCashRepository(userId, amount);
  if (!cashDeposit) {
    throw new ConflictError("Initial cash deposit already exists");
  }

  return "Deposit Success";
};
