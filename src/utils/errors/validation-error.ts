import { CustomError } from "../enums/custom-error-enums.js";
import { AppError } from "./app-error.js";

export class ValidationError extends AppError {
  constructor(
    message = "Input validation failed",
    statusCode = 400,
    error = CustomError.VALIDATION_ERROR
  ) {
    super(message, statusCode, error);
  }
}
