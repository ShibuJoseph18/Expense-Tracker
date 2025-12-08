import { Router } from "express";
import { createCategoryAndUserCategoryController } from "../../controllers/category-controller.js";
import { verifyJwt } from "../../middlewares/jwt-validation-middleware.js";
import { validatePayload } from "../../middlewares/input-validation-middleware.js";
import { createCategoryAndUserCategorySchema } from "../../types/category-types.js";

const categoriesRouter = Router();

categoriesRouter.post(
  "/",
  verifyJwt,
  validatePayload(createCategoryAndUserCategorySchema),
  createCategoryAndUserCategoryController
);

export default categoriesRouter;
