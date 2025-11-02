import { Router } from "express";
import authRouter from "./auth-routes.js";
import accountRouter from "./account-routes.js";
import transactionRouter from "./transaction-routes.js";

const router = Router();

router.use("/auth", authRouter);
router.use("/account", accountRouter);
router.use("/transaction", transactionRouter);
export default router;
