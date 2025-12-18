import { Router } from "express";
import { getUserController } from "../../controllers/users-controller.js";
import { verifyJwt } from "../../middlewares/jwt-validation-middleware.js";

const userRouter = Router();

userRouter.get("/", verifyJwt, getUserController);

export default userRouter;
