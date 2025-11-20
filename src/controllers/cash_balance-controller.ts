import type { Request, Response } from "express";
import { initialCashDepositService } from "../services/cash_balance-service.js";

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
