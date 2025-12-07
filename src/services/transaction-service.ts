import { createTransactionRepository } from "../repository/transaction-repository.js";
import type { CreateTransactionServiceInput } from "../types/transaction-types.js";
import { ServerError } from "../utils/errors/server-error.js";
import { toSQLiteDate } from "../utils/helpers/date-helper.js";
import {
  updateCashBalance,
  negativeCashBalance,
} from "../repository/cash_balances-repository.js";
import {
  negativeAccountBalance,
  updateAccountBalance,
} from "../repository/account-repository.js";
import { atomicTransaction } from "../utils/helpers/transaction-helper.js";
import { verifyUserCategories } from "../repository/user_categories-repository.js";
import { verifyUserSubCategories } from "../repository/user_subcategories-repository.js";

export const createTransactionService = async (
  userId: number,
  transactionServiceInput: CreateTransactionServiceInput
) => {
  const categoryBelongsToUser = await verifyUserCategories(
    userId,
    transactionServiceInput.category_id,
    transactionServiceInput.type
  );

  if (!categoryBelongsToUser) {
    throw new ServerError("Invalid category");
  }

  if (transactionServiceInput.subcategory_id) {
    const subcategoryBelongsToUser = await verifyUserSubCategories(
      userId,
      transactionServiceInput.category_id,
      transactionServiceInput.subcategory_id
    );

    if (!subcategoryBelongsToUser) {
      throw new ServerError("Invalid subcategory");
    }
  }

  const createTransactionRepoInput = {
    ...transactionServiceInput,
    user_id: userId,
    subcategory_id: transactionServiceInput.subcategory_id || null,
    note: transactionServiceInput.note || null,
    date: (transactionServiceInput.date || toSQLiteDate()) as Date,
    account_id: transactionServiceInput.account_id || null,
  };

  switch (transactionServiceInput.type) {
    case "expense":
      switch (transactionServiceInput.is_cash) {
        case 1: {
          // cash transaction
          if (await negativeCashBalance(userId, transactionServiceInput.amount))
            throw new ServerError("Balance will be negative");

          const newTransaction = await atomicTransaction(async () => {
            const transaction = await createTransactionRepository(
              createTransactionRepoInput
            );

            const balance = await updateCashBalance(
              userId,
              -transactionServiceInput.amount
            );

            return { transaction, balance };
          });
          return newTransaction;
        }
        case 0: {
          // account transaction
          if (
            await negativeAccountBalance(
              userId,
              transactionServiceInput.account_id,
              transactionServiceInput.amount
            )
          )
            throw new ServerError("Balance will be negative");

          const newTransaction = await atomicTransaction(async () => {
            const transaction = await createTransactionRepository(
              createTransactionRepoInput
            );

            const balance = await updateAccountBalance(
              userId,
              transactionServiceInput.account_id,
              -transactionServiceInput.amount
            );

            return { transaction, balance };
          });
          return newTransaction;
        }
      }
    case "income":
      switch (transactionServiceInput.is_cash) {
        case 1: {
          // cash transaction
          const newTransaction = await atomicTransaction(async () => {
            const transaction = await createTransactionRepository(
              createTransactionRepoInput
            );

            const balance = await updateCashBalance(
              userId,
              transactionServiceInput.amount
            );

            return { transaction, balance };
          });
          return newTransaction;
        }
        case 0: {
          // account transaction
          const newTransaction = await atomicTransaction(async () => {
            const transaction = await createTransactionRepository(
              createTransactionRepoInput
            );

            const balance = await updateAccountBalance(
              userId,
              transactionServiceInput.account_id,
              transactionServiceInput.amount
            );

            return { transaction, balance };
          });
          return newTransaction;
        }
      }
  }
};
