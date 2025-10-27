import { Router } from "express";
import {
  registerController,
  loginController,
} from "../../controllers/auth-controller.js";
import { validatePayload } from "../../middlewares/input-validation-middleware.js";
import { registerSchema, loginSchema } from "../../types/auth-types.js";
// import { user } from "../../controllers/user-controller.js";

const authRouter = Router();

authRouter.post(
  "/register",
  validatePayload(registerSchema),
  registerController
);

authRouter.post("/login", validatePayload(loginSchema), loginController);

export default authRouter;
