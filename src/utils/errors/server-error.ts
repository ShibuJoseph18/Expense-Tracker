import { AppError } from "./app-error.js";
import { CustomError } from "../enums/custom-error-enums.js";

export class ServerError extends AppError {
  constructor(
    message = "Internal server error",
    statusCode = 500,
    error = CustomError.SERVER_ERROR
  ) {
    super(message, statusCode, error);
  }
}
