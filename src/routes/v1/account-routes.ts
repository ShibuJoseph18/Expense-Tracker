import { Router } from "express";
import { validatePayload } from "../../middlewares/input-validation-middleware.js";
import {
  accountUserInputSchema,
  initialAccountDepositSchema,
  getAccountSchema,
} from "../../types/account-types.js";
import {
  createAccountController,
  initialAccountDepositController,
  getAccountController,
  getAllAccountsController,
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

accountRouter.get("/:account_id", verifyJwt, getAccountController);

accountRouter.get("/", verifyJwt, getAllAccountsController);

export default accountRouter;
