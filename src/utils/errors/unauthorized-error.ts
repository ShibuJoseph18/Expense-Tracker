import { CustomError } from "../enums/custom-error-enums.js";
import { AppError } from "./app-error.js";

export class UnauthorizedError extends AppError {
  constructor(
    message = "Resource doesn't exist",
    statusCode = 401,
    error = CustomError.UNAUTHORIZED_ERROR
  ) {
    super(message, statusCode, error);
  }
}
