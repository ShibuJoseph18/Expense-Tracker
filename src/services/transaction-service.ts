import {
  createTransactionRepository,
  getTransactions,
} from "../repository/transaction-repository.js";
import type {
  CreateTransactionServiceInput,
  GetTransactionServiceInput,
  GetTransactionServiceOutput,
} from "../types/transaction-types.js";
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
import { omitAuditFields } from "../utils/helpers/response-helper.js";
import { pendoTrack } from "../utils/pendo-track.js";

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

  const trackTransactionCreated = () => {
    pendoTrack("transaction_created", String(userId), {
      transaction_type: transactionServiceInput.type,
      amount: transactionServiceInput.amount,
      is_cash: transactionServiceInput.is_cash,
      category_id: transactionServiceInput.category_id,
      has_subcategory: Boolean(transactionServiceInput.subcategory_id),
      has_note: Boolean(transactionServiceInput.note),
      has_custom_date: Boolean(transactionServiceInput.date),
      account_id: transactionServiceInput.account_id || 0,
    });
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
          trackTransactionCreated();
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
          trackTransactionCreated();
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
          trackTransactionCreated();
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
          trackTransactionCreated();
          return newTransaction;
        }
      }
  }
};

export const getTransactionService = async (
  userId: number,
  getTransactionServiceInput: GetTransactionServiceInput
): Promise<GetTransactionServiceOutput> => {
  // Refactor input mathcing the defined type
  const transactions = await getTransactions(userId, {
    transactionType: getTransactionServiceInput.transaction_type,
    entity: getTransactionServiceInput.entity,
    offset: getTransactionServiceInput.offset,
    limit: getTransactionServiceInput.limit,
  });

  const getTransactionServiceOutput = transactions.map((transaction) =>
    omitAuditFields(transaction)
  );

  pendoTrack("transactions_filtered", String(userId), {
    transaction_type_filter: getTransactionServiceInput.transaction_type || "all",
    entity_filter: getTransactionServiceInput.entity || "all",
    offset: getTransactionServiceInput.offset || 0,
    limit: getTransactionServiceInput.limit || 10,
    results_count: transactions.length,
  });

  return {
    filters: {
      transaction_type: getTransactionServiceInput.transaction_type,
      entity: getTransactionServiceInput.entity,
      offset: getTransactionServiceInput.offset,
      limit: getTransactionServiceInput.limit,
    },
    transaction: {
      count_of_transactions: transactions.length,
      transactions: getTransactionServiceOutput,
    },
  } as GetTransactionServiceOutput;
};
