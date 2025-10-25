import { AppError } from "./app-error.js";
import { CustomError } from "../enums/custom-error-enums.js";

export class ConflictError extends AppError {
  constructor(
    message = "Resource already exists",
    statusCode = 409,
    error = CustomError.CONFLICT_ERROR
  ) {
    super(message, statusCode, error);
  }
}
