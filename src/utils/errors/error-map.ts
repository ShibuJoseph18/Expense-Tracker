import { CustomError } from "../enums/custom-error-enums.js";
import { ConflictError } from "./conflict-error.js";
import { ServerError } from "./server-error.js";
import { UnauthorizedError } from "./unauthorized-error.js";
import { ValidationError } from "./validation-error.js";

export const errorMapper = (err: any) => {
  if (
    err instanceof ValidationError ||
    err instanceof UnauthorizedError ||
    err instanceof ConflictError
  ) {
    return err;
  }

  return new ServerError();
};
