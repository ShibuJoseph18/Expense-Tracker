import type { Request, Response } from "express";
import { createCategoryAndUserCategoryService } from "../services/categories-service.js";

export const createCategoryAndUserCategoryController = async (
  req: Request,
  res: Response
) => {
  const category = await createCategoryAndUserCategoryService(
    req.accessToken.id,
    req.validatedReqBody
  );

  res.status(200).json({
    message: "Category created successfully",
    category: category,
  });
};
