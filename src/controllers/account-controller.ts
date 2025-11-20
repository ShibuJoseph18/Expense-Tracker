import type { Request, Response } from "express";
import {
  createAccountService,
  initialAccountDepositService,
} from "../services/account-service.js";

export const createAccountController = async (req: Request, res: Response) => {
  const newAccount = await createAccountService(
    req.accessToken.id,
    req.validatedReqBody
  );

  res.status(200).json({
    message: "Account created successfully",
    account: newAccount,
  });
};

export const initialAccountDepositController = async (
  req: Request,
  res: Response
) => {
  console.log("check1");
  const accountDeposit = await initialAccountDepositService(
    req.accessToken.id,
    req.validatedReqBody
  );

  res.status(200).json({
    message: `Account ${accountDeposit}`,
  });
};
