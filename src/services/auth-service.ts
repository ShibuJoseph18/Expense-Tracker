import { db } from "../config/db-config.js";
import bcrypt from "bcrypt";
import { UnauthorizedError } from "../utils/errors/unauthorized-error.js";
import jwt from "jsonwebtoken";
import config from "../config/config.js";
import { ConflictError } from "../utils/errors/conflict-error.js";
import type { RegisterType, LoginType } from "../types/auth-types.js";
import { ServerError } from "../utils/errors/server-error.js";
import { isValidPassword } from "../utils/helpers/auth-helper.js";

export const registerService = async (userCreationInput: RegisterType) => {
  const hashed_password = await bcrypt.hash(
    userCreationInput.password,
    config.saltRounds
  );
  userCreationInput.password = hashed_password;

  const insertNewUser = await db.run(
    `INSERT OR IGNORE INTO users (name, email, password, mobile)
       VALUES ($name, $email, $password, $mobile)`,
    {
      $name: userCreationInput.name,
      $email: userCreationInput.email,
      $password: userCreationInput.password,
      $mobile: userCreationInput.mobile,
    }
  );
  if (insertNewUser.changes === 0) {
    throw new ConflictError("User already exists", 409);
  }

  const newUser = await db.get(
    `SELECT id, name, email, mobile, created_at, updated_at FROM users WHERE id = $id`,
    {
      $id: insertNewUser.lastID,
    }
  );
  if (!newUser) {
    throw new ServerError();
  }

  return newUser;
};

export const loginService = async (userCredentials: LoginType) => {
  const existingUser = await db.get(
    `SELECT * FROM users WHERE email = $email`,
    {
      $email: userCredentials.email,
    }
  );
  if (!existingUser) {
    //Preventive measure for timing attacks
    await isValidPassword({
      plainText: userCredentials.password,
      hash: "3598&(**738749HGdasgdhgasdfhg",
    });
    throw new UnauthorizedError("User doesn't exist", 401);
  }

  const { password, ...existingUserInfo } = existingUser;

  const validPassword = await isValidPassword({
    plainText: userCredentials.password,
    hash: password,
  });
  if (!validPassword) {
    throw new UnauthorizedError("Invalid password", 401);
  }

  const { createdAt, updatedAt, ...accessTokenPayload } = existingUserInfo;
  const accessToken = jwt.sign(accessTokenPayload, config.jwtSecretKey, {
    expiresIn: "3h",
  });
  return { existingUserInfo, accessToken };
};
