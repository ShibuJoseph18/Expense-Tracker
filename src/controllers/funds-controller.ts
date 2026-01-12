import type { Request, Response } from "express";
import {
  createFundService,
  updateFundService,
} from "../services/funds-service.js";
import { validateIntegerParams } from "../utils/helpers/general-helper.js";

export const createFundController = async (req: Request, res: Response) => {
  const fund = await createFundService({
    user_id: req.accessToken.id,
    ...req.validatedReqBody,
  });

  res.status(200).json({
    message: "Fund created successfully",
    fund: fund,
  });
};

export const updateFundController = async (req: Request, res: Response) => {
  const fundId = validateIntegerParams.safeParse(req.params.fund_id);
  if (!fundId.success) {
    res.status(400).json({
      message: "Invalid fund_id is not passed",
    });
    return;
  }
  const fund = await updateFundService({
    id: fundId.data,
    user_id: req.accessToken.id,
    ...req.validatedReqBody,
  });

  res.status(200).json({
    message: "Fund updated successfully",
    fund: fund,
  });
};
