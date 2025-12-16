import { Router } from "express";
import { createSubCategoryAndUserSubCategoryController } from "../../controllers/subcategories-controller.js";
import { verifyJwt } from "../../middlewares/jwt-validation-middleware.js";
import { validatePayload } from "../../middlewares/input-validation-middleware.js";
import { CreateSubCategoryAndUserSubCategorySchema } from "../../types/subcategory-types.js";

const subcategoriesRouter = Router();

subcategoriesRouter.post(
  "/",
  verifyJwt,
  validatePayload(CreateSubCategoryAndUserSubCategorySchema),
  createSubCategoryAndUserSubCategoryController
);

export default subcategoriesRouter;
