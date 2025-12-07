import { ZodType } from "zod";
import type { Request, Response, NextFunction } from "express";
import { ValidationError } from "../utils/errors/validation-error.js";

export const validatePayload =
  (zodSchema: ZodType) => (req: Request, res: Response, next: NextFunction) => {
    const validateInput = zodSchema.safeParse(req.body);
    if (validateInput.error) {
      throw new ValidationError();
    }
    req.validatedReqBody = validateInput.data;
    return next();
  };
