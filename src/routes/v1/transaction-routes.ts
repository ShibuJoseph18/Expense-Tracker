import { Router } from "express";
import { createTransactionController } from "../../controllers/transaction-controller.js";
import { verifyJwt } from "../../middlewares/jwt-validation-middleware.js";
import { transactionSchema } from "../../types/transaction-types.js";
import { validatePayload } from "../../middlewares/input-validation-middleware.js";

const transactionRouter = Router();

transactionRouter.post(
  "/",
  verifyJwt,
  validatePayload(transactionSchema),
  createTransactionController
);

export default transactionRouter;
