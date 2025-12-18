import { db } from "../config/db-config.js";
import { ConflictError } from "../utils/errors/conflict-error.js";
import type { User, UserCreationRepoInput } from "../types/user-types.js";

export const createUserRepository = async (
  user: UserCreationRepoInput
): Promise<User> => {
  const existingUser = await isExistingUserByEmail(user.email);
  if (existingUser) {
    throw new ConflictError("User already exists");
  }

  const newUserInsert = await db.run(
    `
    INSERT INTO users (name, email, password, mobile) 
    VALUES($name, $email, $password, $mobile)
    `,
    {
      $name: user.name,
      $email: user.email,
      $password: user.password,
      $mobile: user.mobile,
    }
  );

  const newUser = await db.get(
    `
    SELECT * FROM users 
    WHERE id = $id
    `,
    {
      $id: newUserInsert.lastID,
    }
  );

  return newUser;
};

export const isExistingUserByEmail = async (
  email: string
): Promise<Boolean> => {
  const existingUser = await db.get(
    `
    SELECT id FROM users 
    WHERE email = $email
    `,
    {
      $email: email,
    }
  );
  return existingUser ? true : false;
};

export const isExistingUserById = async (id: number): Promise<Boolean> => {
  const existingUser = await db.get(
    `
    SELECT id FROM users 
    WHERE id = $id
    `,
    {
      $id: id,
    }
  );
  return existingUser ? true : false;
};

export const getUserByEmail = async (
  email: string
): Promise<User | undefined> => {
  const existingUser = await db.get(
    `
    SELECT * FROM users 
    WHERE email = $email
    `,
    {
      $email: email,
    }
  );
  return existingUser;
};

export const getUserById = async (id: number): Promise<User | undefined> => {
  const existingUser = await db.get(
    `
    SELECT * FROM users 
    WHERE id = $id
    `,
    {
      $id: id,
    }
  );
  return existingUser;
};
