import type { Request, Response } from "express";
import {
  createAccountService,
  initialAccountDepositService,
  getAccountService,
  getAllAccountsService,
} from "../services/account-service.js";
import { validateIntegerParams } from "../utils/helpers/general-helper.js";

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
  const accountDeposit = await initialAccountDepositService(
    req.accessToken.id,
    req.validatedReqBody
  );

  res.status(200).json({
    message: `Account ${accountDeposit}`,
  });
};

export const getAccountController = async (req: Request, res: Response) => {
  const validParams = validateIntegerParams.safeParse(req.params.account_id);
  if (!validParams.success) {
    res.status(400).json({
      message: "Invalid account_id is not passed",
    });
    return;
  }

  const account = await getAccountService(req.accessToken.id, {
    account_id: validParams.data,
  });

  res.status(200).json({
    message: "Account fetched successfully",
    account: account,
  });
};

export const getAllAccountsController = async (req: Request, res: Response) => {
  const accounts = await getAllAccountsService(req.accessToken.id);

  res.status(200).json({
    message: "Accounts fetched successfully",
    accounts: accounts,
  });
};
