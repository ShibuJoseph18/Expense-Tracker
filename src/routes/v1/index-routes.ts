import { Router } from "express";
import authRouter from "./auth-routes.js";
import accountRouter from "./account-routes.js";
import transactionRouter from "./transaction-routes.js";
import cashBalanceRouter from "./cash_balance-routes.js";

const router = Router();

router.use("/auth", authRouter);
router.use("/account", accountRouter);
router.use("/transaction", transactionRouter);
router.use("/cash", cashBalanceRouter);
export default router;
