import { Router } from "express";
import authRouter from "./auth-routes.js";
import accountRouter from "./account-routes.js";
import transactionRouter from "./transaction-routes.js";
import cashBalanceRouter from "./cash_balance-routes.js";
import categoriesRouter from "./categories-routes.js";
import subcategoriesRouter from "./subcategories-routes.js";
import userRouter from "./users-routes.js";

const router = Router();

router.use("/auth", authRouter);
router.use("/account", accountRouter);
router.use("/transaction", transactionRouter);
router.use("/cash", cashBalanceRouter);
router.use("/categories", categoriesRouter);
router.use("/subcategories", subcategoriesRouter);
router.use("/user", userRouter);

export default router;
