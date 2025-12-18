import * as z from "zod";
import type { User } from "./user-types.js";

export const registerSchema = z.object({
  name: z.string().regex(/^[A-Za-z ]+$/, "Name must contain only letters"),
  email: z.email(),
  password: z.string(),
  mobile: z.string().optional(),
});

export const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(2).max(25),
});

export type RegisterServiceInput = Pick<
  User,
  "name" | "email" | "password" | "mobile"
>;

export type RegisterServiceOutput = Pick<User, "name" | "email" | "mobile">;

export type LoginServiceInput = Pick<User, "email" | "password">;

export type LoginServiceOutput = string;
