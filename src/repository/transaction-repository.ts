import { db } from "../config/db-config.js";
import type {
  Transaction,
  CreateTransactionRepoInput,
  GetTransactionRepositoryInput,
} from "../types/transaction-types.js";

export const createTransactionRepository = async (
  transaction: CreateTransactionRepoInput
): Promise<Transaction> => {
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

export const getTransactions = async (
  userId: number,
  filters: GetTransactionRepositoryInput
) => {
  // Base condition
  let whereClause = `WHERE t.user_id = ${userId} and t.deleted = 0`;

  // Transaction type filter -> ["income", "expense"]
  if (filters.transactionType !== undefined) {
    whereClause = whereClause + ` AND t.type = '${filters.transactionType}'`;
  }

  // Entity -> ["cash", "account"]
  if (filters.entity !== undefined) {
    if (filters.entity === "cash") {
      whereClause = whereClause + ` AND t.is_cash = 1`;
    } else if (filters.entity === "account") {
      whereClause = whereClause + ` AND t.is_cash = 0`;
    }
  }

  // offset
  let offsetClause;
  if (filters.offset !== undefined) {
    offsetClause = `OFFSET ${filters.offset}`;
  } else {
    offsetClause = "";
  }

  // limit
  let limitClause;
  if (filters.limit !== undefined) {
    limitClause = `LIMIT ${filters.limit}`;
  } else {
    limitClause = "";
  }

  const transactions = await db.all(
    `
    SELECT t.*, c.name as category_name, sc.name as subcategory_name 
    FROM transactions t
    LEFT JOIN categories c ON t.category_id = c.id
    LEFT JOIN subcategories sc ON t.subcategory_id = sc.id 
    ${whereClause}
    ORDER BY date DESC 
    ${limitClause}
    ${offsetClause}
    `
  );

  return transactions;
};
