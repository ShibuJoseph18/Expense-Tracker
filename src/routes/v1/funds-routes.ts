import { Router } from "express";
import { validatePayload } from "../../middlewares/input-validation-middleware.js";
import { createFundSchema, updateFundSchema } from "../../types/funds-types.js";
import { verifyJwt } from "../../middlewares/jwt-validation-middleware.js";
import {
  createFundController,
  updateFundController,
} from "../../controllers/funds-controller.js";

const fundRouter = Router();

fundRouter.post(
  "/",
  verifyJwt,
  validatePayload(createFundSchema),
  createFundController
);

fundRouter.put(
  "/:fund_id",
  verifyJwt,
  validatePayload(updateFundSchema),
  updateFundController
);

export default fundRouter;
