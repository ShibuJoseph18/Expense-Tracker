import { db } from "../config/db-config.js";
import { createTransactionRepository } from "../repository/transaction-repository.js";
import type {
  transactionServiceInputType,
  transactionServiceOutputType,
} from "../types/transaction-types.js";
import { toSQLiteDate, toUTCISO } from "../utils/helpers/date-helper.js";

export const createTransactionService = async (
  userId: number,
  transactionServiceInput: transactionServiceInputType
): Promise<transactionServiceOutputType> => {
  const transactionRepoInput = {
    ...transactionServiceInput,
    user_id: userId,
    subcategory_id: transactionServiceInput.subcategory_id || null,
    note: transactionServiceInput.note || null,
    date: transactionServiceInput.date || toSQLiteDate(),
  };

  const transactionRepoOutput = await createTransactionRepository(
    transactionRepoInput
  );

  const { created_at, updated_at, ...transactionServiceOutput } =
    transactionRepoOutput;

  return transactionServiceOutput;
};
