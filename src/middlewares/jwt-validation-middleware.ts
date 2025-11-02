import jwt from "jsonwebtoken";
import type { Request, Response, NextFunction } from "express";
import config from "../config/config.js";
import { UnauthorizedError } from "../utils/errors/unauthorized-error.js";
import { getUserById } from "../services/auth-service.js";

export const verifyJwt = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const jwtHeader = req.header("authorization");
  if (!jwtHeader) {
    return;
  }

  if (!jwtHeader.startsWith("Bearer")) {
    throw new Error("Token missing Bearer");
  }
  const jwtToken = jwtHeader.replace("Bearer ", "");
  let decodedToken: any;
  try {
    decodedToken = jwt.verify(jwtToken, config.jwtSecretKey);
  } catch (err: any) {
    if (err instanceof jwt.TokenExpiredError) {
      throw new UnauthorizedError("Token Expired", 401);
    }
    throw new UnauthorizedError("Invalid token", 401);
  }

  const user = await getUserById(decodedToken.id);
  if (!user) {
    throw new UnauthorizedError("User doesn't exist", 401);
  }

  req.accessToken = decodedToken;

  return next();
};
