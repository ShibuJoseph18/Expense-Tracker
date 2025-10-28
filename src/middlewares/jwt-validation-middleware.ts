import jwt from "jsonwebtoken";
import type { Request, Response, NextFunction } from "express";
import type { ResolveFnOutput } from "module";

import config from "../config/config.js";
import { UnauthorizedError } from "../utils/errors/unauthorized-error.js";
export const verifyJwt = (req: Request, res: Response, next: NextFunction) => {
  const jwtHeader = req.header("authorization");
  if (!jwtHeader) {
    return;
  }

  if (!jwtHeader.startsWith("Bearer")) {
    throw new Error("Token missing Bearer");
  }
  const jwtToken = jwtHeader.replace("Bearer ", "");
  jwt.verify(jwtToken, config.jwtSecretKey, (err, decodedToken) => {
    if (err) {
      if (err instanceof jwt.TokenExpiredError) {
        throw new UnauthorizedError("Token Expired");
      }
      throw new UnauthorizedError("Invalid token");
    }
    req.jwtToken = decodedToken;
  });

  return next();
};
