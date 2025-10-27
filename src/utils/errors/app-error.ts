import { CustomError } from "../enums/custom-error-enums.js";

export class AppError extends Error {
  statusCode: number;
  error: any;

  constructor(message: string, statusCode = 500, error: CustomError) {
    super(message);
    this.name = this.constructor.name;
    this.error = error;
    this.statusCode = statusCode;

    // No need for Object.setPrototypeOf
    // Optional: Error.captureStackTrace(this, this.constructor);
  }
}
