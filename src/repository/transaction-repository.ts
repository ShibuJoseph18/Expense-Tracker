import { db } from "../config/db-config.js";
import type {
  TransactionType,
  CreateTransactionRepoInput,
} from "../types/transaction-types.js";

export const createTransactionRepository = async (
  transaction: CreateTransactionRepoInput
): Promise<TransactionType> => {
  const newTransactionInsert = await db.run(
    `INSERT INTO transactions 
    (user_id, type, amount, is_cash, account_id, category_id, subcategory_id, note, date)
    VALUES($user_id, $type, $amount, $is_cash, $account_id, $category_id, $subcategory_id, $note, $date)`,
    {
      $user_id: transaction.user_id,
      $type: transaction.type,
      $amount: transaction.amount,
      $is_cash: transaction.is_cash,
      $account_id: transaction.account_id,
      $category_id: transaction.category_id,
      $subcategory_id: transaction.subcategory_id,
      $note: transaction.note,
      $date: transaction.date,
    }
  );

  const newTransaction = await db.get(
    `SELECT * FROM transactions WHERE id = $id`,
    {
      $id: newTransactionInsert.lastID,
    }
  );

  return newTransaction;
};
