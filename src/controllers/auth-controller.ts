import type { Request, Response } from "express";
import { loginService, registerService } from "../services/auth-service.js";

export const registerController = async (req: Request, res: Response) => {
  const newUser = await registerService(req.validatedReqBody);
  const { id, password, ...responseInfo } = newUser;
  res.status(200).json({
    message: "User created successfully",
    data: { user: responseInfo },
  });
  return;
};

export const loginController = async (req: Request, res: Response) => {
  const user = await loginService(req.validatedReqBody);
  res.status(200).json({
    message: "User signed in successfully",
    accessToken: user.accessToken,
  });
};
