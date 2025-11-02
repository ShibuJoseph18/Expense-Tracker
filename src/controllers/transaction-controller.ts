import type { Request, Response } from "express";
import { createTransactionService } from "../services/transaction-service.js";

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
