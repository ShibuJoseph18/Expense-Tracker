import type { Request, Response } from "express";
import { getUserService } from "../services/users-service.js";

export const getUserController = async (req: Request, res: Response) => {
  const user = await getUserService(req.accessToken.id);
  res.status(200).json({
    message: "User fetched successfully",
    user: user,
  });
};
