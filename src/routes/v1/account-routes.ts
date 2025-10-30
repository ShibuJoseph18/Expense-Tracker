import { Router } from "express";
import { validatePayload } from "../../middlewares/input-validation-middleware.js";
import { accountSchema } from "../../types/account-types.js";
import { createAccountController } from "../../controllers/account-controller.js";
import { verifyJwt } from "../../middlewares/jwt-validation-middleware.js";

const accountRouter = Router();

accountRouter.post(
  "/",
  verifyJwt,
  validatePayload(accountSchema),
  createAccountController
);

export default accountRouter;
