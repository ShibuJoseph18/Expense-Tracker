import { Router } from "express";
import { initialCashDepositController } from "../../controllers/cash_balance-controller.js";
import { verifyJwt } from "../../middlewares/jwt-validation-middleware.js";
import { validatePayload } from "../../middlewares/input-validation-middleware.js";
import { initialCashDepositSchema } from "../../types/cash_balance-types.js";

const cashBalanceRouter = Router();
cashBalanceRouter.post(
  "/initial-deposit",
  verifyJwt,
  validatePayload(initialCashDepositSchema),
  initialCashDepositController
);

export default cashBalanceRouter;
