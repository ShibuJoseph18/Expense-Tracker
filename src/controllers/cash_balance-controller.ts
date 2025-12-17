import type { Request, Response } from "express";
import {
  initialCashDepositService,
  getCashBalanceService,
} from "../services/cash_balance-service.js";

export const initialCashDepositController = async (
  req: Request,
  res: Response
) => {
  const deposit = await initialCashDepositService(
    req.accessToken.id,
    req.validatedReqBody
  );
  res.status(200).json({ message: `Cash ${deposit}` });
};

export const getCashBalanceController = async (req: Request, res: Response) => {
  const cashBalance = await getCashBalanceService(req.accessToken.id);
  res.status(200).json({
    message: "Cash balance fetched sucessfully",
    cash_balance: cashBalance,
  });
};
