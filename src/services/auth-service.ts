import { eq } from "drizzle-orm";
import db from "../config/db-config.js";
import users from "../schemas/users.js";
import bcrypt from "bcrypt";
import { UnauthorizedError } from "../utils/errors/unauthorized-error.js";
import jwt from "jsonwebtoken";
import config from "../config/config.js";
import { ConflictError } from "../utils/errors/conflict-error.js";
import type { RegisterType, LoginType } from "../types/auth-types.js";

export const registerService = async (userCreationInput: RegisterType) => {
  const hashed_password = await bcrypt.hash(
    userCreationInput.password,
    config.saltRounds
  );
  userCreationInput.password = hashed_password;
  const [newUser] = await db
    .insert(users)
    .values(userCreationInput)
    .onConflictDoNothing()
    .returning();

  if (!newUser) {
    throw new ConflictError("User already exists", 409);
  }
  return newUser;
};

export const loginService = async (userCredentials: LoginType) => {
  const [existingUser] = await db
    .select()
    .from(users)
    .where(eq(users.email, userCredentials.email));
  if (!existingUser) {
    throw new UnauthorizedError("User doesn't exist", 401);
  }

  const { password, ...existingUserInfo } = existingUser;
  const { createdAt, updatedAt, ...accessTokenPayload } = existingUserInfo;

  const validPassword = await bcrypt.compare(
    userCredentials.password,
    password
  );
  if (!validPassword) {
    throw new UnauthorizedError("Invalid password", 401);
  }

  const accessToken = jwt.sign(accessTokenPayload, config.jwtSecretKey, {
    expiresIn: "3h",
  });

  return { existingUserInfo, accessToken };
};
