import type { Request, Response } from "express";
import { createAccountService } from "../services/account-service.js";

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
