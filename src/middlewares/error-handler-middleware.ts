// middlewares/errorHandler.ts
import type { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/errors/app-error.js";
import { errorMapper } from "../utils/errors/error-map.js";

export const errorHandler = (
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  err = errorMapper(err);
  const { status, ...responseInfo } = {
    status: err.statusCode || 500,
    error: err.error || "Error",
    message: err.message || "Internal server error",
  };

  res.status(status).json(responseInfo);
};
