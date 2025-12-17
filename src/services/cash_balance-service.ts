import { db } from "../config/db-config.js";
import {
  getCashBalance,
  initialDepositCashRepository,
} from "../repository/cash_balances-repository.js";
import { ConflictError } from "../utils/errors/conflict-error.js";
import { ServerError } from "../utils/errors/server-error.js";
import type {
  InitialCashDepositService,
  GetCashBalanceServiceOutput,
} from "../types/cash_balance-types.js";
import { UnauthorizedError } from "../utils/errors/unauthorized-error.js";
import { omitAuditFields } from "../utils/helpers/response-helper.js";

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
  initialDepositInput: InitialCashDepositService
) => {
  const { amount } = initialDepositInput;
  const cashDeposit = await initialDepositCashRepository(userId, amount);
  if (!cashDeposit) {
    throw new ConflictError("Initial cash deposit already exists");
  }

  return "Deposit Success";
};

export const getCashBalanceService = async (
  userId: number
): Promise<GetCashBalanceServiceOutput> => {
  const cashBalance = await getCashBalance(userId);
  if (!cashBalance) {
    throw new UnauthorizedError("Cash balance doesn't exist");
  }
  const cashBalanceServiceOutput = omitAuditFields(cashBalance);
  return cashBalanceServiceOutput as GetCashBalanceServiceOutput;
};
