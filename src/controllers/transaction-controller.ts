import type { Request, Response } from "express";
import {
  createTransactionService,
  getTransactionService,
} from "../services/transaction-service.js";
import { getTransactionSchema } from "../types/transaction-types.js";

export const createTransactionController = async (
  req: Request,
  res: Response
) => {
  const newTransaction = await createTransactionService(
    req.accessToken.id,
    req.validatedReqBody
  );

  res.status(200).json({
    message: "Transaction created successfully",
    transaction: newTransaction,
  });
};

export const getTransactionsController = async (
  req: Request,
  res: Response
) => {
  const validateQueryParams = getTransactionSchema.safeParse(req.query);
  if (!validateQueryParams.success) {
    res.status(400).json({
      message: "Invalid query params key or value is passed",
      valid_query_params: ["transaction_type", "entity", "offset", "limit"],
    });
    return;
  }

  const transactions = await getTransactionService(
    req.accessToken.id,
    validateQueryParams.data
  );

  res.status(200).json({
    message: "Transactions fetched successfully",
    filters: transactions.filters,
    transaction: transactions.transaction,
  });
};
