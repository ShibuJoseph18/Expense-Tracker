import { db } from "../config/db-config.js";
import bcrypt from "bcrypt";
import { UnauthorizedError } from "../utils/errors/unauthorized-error.js";
import jwt from "jsonwebtoken";
import config from "../config/config.js";
import { ConflictError } from "../utils/errors/conflict-error.js";
import type {
  RegisterServiceInputType,
  RegisterServiceOutputType,
  LoginServiceInputType,
  LoginServiceOutputType,
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

export const registerService = async (
  registerServiceInput: RegisterServiceInputType
): Promise<RegisterServiceOutputType> => {
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

  return userInfo;
};

export const loginService = async (
  loginServiceInput: LoginServiceInputType
): Promise<LoginServiceOutputType> => {
  const existingUser = await getUserByEmail(loginServiceInput.email);
  if (!existingUser) {
    //Preventive measure for timing attacks
    await isValidPassword({
      plainText: loginServiceInput.password,
      hash: "3598&(**738749HGdasgdhgasdfhg",
    });
    throw new UnauthorizedError("User doesn't exist", 401);
  }

  const { password, ...existingUserInfo } = existingUser;

  const validPassword = await isValidPassword({
    plainText: loginServiceInput.password,
    hash: password,
  });
  if (!validPassword) {
    throw new UnauthorizedError("Invalid password", 401);
  }

  const { created_at, updated_at, ...accessTokenPayload } = existingUserInfo;
  const accessToken = jwt.sign(accessTokenPayload, config.jwtSecretKey, {
    expiresIn: "3h",
  });
  return { accessToken };
};

