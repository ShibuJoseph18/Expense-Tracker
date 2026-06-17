import { db } from "../config/db-config.js";
import bcrypt from "bcrypt";
import { UnauthorizedError } from "../utils/errors/unauthorized-error.js";
import jwt from "jsonwebtoken";
import config from "../config/config.js";
import { ConflictError } from "../utils/errors/conflict-error.js";
import type {
  RegisterServiceInput,
  RegisterServiceOutput,
  LoginServiceInput,
  LoginServiceOutput,
} from "../types/auth-types.js";
import { ServerError } from "../utils/errors/server-error.js";
import { isValidPassword } from "../utils/helpers/auth-helper.js";
import {
  createUserRepository,
  getUserByEmail,
} from "../repository/user-repository.js";
import { intializeCashBalance } from "../repository/cash_balances-repository.js";
import { intializeDefaultCategories } from "../repository/categories-repository.js";
import { intializeDefaultSubCategories } from "../repository/subcategories-repository.js";
import { omitAuditFields } from "../utils/helpers/response-helper.js";
import { pendoTrack } from "../utils/pendo-track.js";

export const registerService = async (
  registerServiceInput: RegisterServiceInput
): Promise<RegisterServiceOutput> => {
  const hashed_password = await bcrypt.hash(
    registerServiceInput.password,
    config.saltRounds
  );
  registerServiceInput.password = hashed_password;
  const user = await createUserRepository(registerServiceInput);
  const { password, ...userInfo } = user;

  const userCategories = await intializeDefaultCategories(userInfo.id);
  if (!userCategories) {
    throw new ServerError();
  }

  const userSubCategories = await intializeDefaultSubCategories(userInfo.id);
  if (!userSubCategories) {
    throw new ServerError();
  }

  const userCashBalance = await intializeCashBalance(userInfo.id);
  if (!userCashBalance) {
    throw new ServerError();
  }

  pendoTrack("user_registered", String(userInfo.id), {
    user_id: userInfo.id,
    has_mobile: Boolean(registerServiceInput.mobile),
  });

  return userInfo;
};

export const loginService = async (
  loginServiceInput: LoginServiceInput
): Promise<LoginServiceOutput> => {
  const existingUser = await getUserByEmail(loginServiceInput.email);
  if (!existingUser) {
    //Preventive measure for timing attacks
    await isValidPassword({
      plainText: loginServiceInput.password,
      hash: "3598&(**738749HGdasgdhgasdfhg",
    });
    throw new UnauthorizedError("User doesn't exist", 401);
  }

  const validPassword = await isValidPassword({
    plainText: loginServiceInput.password,
    hash: existingUser.password,
  });
  if (!validPassword) {
    throw new UnauthorizedError("Invalid password", 401);
  }

  const accessTokenPayload = omitAuditFields(existingUser, ["password"]);
  const accessToken = jwt.sign(accessTokenPayload, config.jwtSecretKey, {
    expiresIn: "3h",
  });

  pendoTrack("user_logged_in", String(existingUser.id), {
    user_id: existingUser.id,
    token_expiry: "3h",
  });

  return accessToken;
};
