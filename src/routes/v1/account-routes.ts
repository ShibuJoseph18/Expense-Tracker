import { Router } from "express";
import { validatePayload } from "../../middlewares/input-validation-middleware.js";
import {
  accountUserInputSchema,
  initialAccountDepositSchema,
} from "../../types/account-types.js";
import {
  createAccountController,
  initialAccountDepositController,
} from "../../controllers/account-controller.js";
import { verifyJwt } from "../../middlewares/jwt-validation-middleware.js";

const accountRouter = Router();

accountRouter.post(
  "/",
  verifyJwt,
  validatePayload(accountUserInputSchema),
  createAccountController
);

accountRouter.post(
  "/initial-deposit",
  verifyJwt,
  validatePayload(initialAccountDepositSchema),
  initialAccountDepositController
);

export default accountRouter;
