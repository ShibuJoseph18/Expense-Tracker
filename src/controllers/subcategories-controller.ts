import type { Request, Response } from "express";
import { createSubCategoryAndUserSubCategoryService } from "../services/subcategory-service.js";

export const createSubCategoryAndUserSubCategoryController = async (
  req: Request,
  res: Response
) => {
  const subcategory = await createSubCategoryAndUserSubCategoryService(
    req.accessToken.id,
    req.validatedReqBody
  );

  res.status(200).json({
    message: "Subcategory created successfully",
    subcategory: subcategory,
  });
};
