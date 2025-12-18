import type { Request, Response } from "express";
import { loginService, registerService } from "../services/auth-service.js";

export const registerController = async (req: Request, res: Response) => {
  const newUser = await registerService(req.validatedReqBody);
  res.status(200).json({
    message: "User created successfully",
    data: { user: newUser },
  });
};

export const loginController = async (req: Request, res: Response) => {
  const accessToken = await loginService(req.validatedReqBody);
  res.status(200).json({
    message: "User logged in successfully",
    access_token: accessToken,
  });
};
