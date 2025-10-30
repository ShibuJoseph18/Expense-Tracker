import { Router } from "express";
import authRouter from "./auth-routes.js";
import accountRouter from "./account-routes.js";

const router = Router();

router.use("/auth", authRouter);
router.use("/account", accountRouter);
export default router;
