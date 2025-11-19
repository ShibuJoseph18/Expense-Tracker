import * as z from "zod";
import type { UserType } from "./user-types.js";

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

export type RegisterServiceInputType = Pick<
  UserType,
  "name" | "email" | "password" | "mobile"
>;

export type RegisterServiceOutputType = Pick<
  UserType,
  "name" | "email" | "mobile"
>;

export type LoginServiceInputType = Pick<UserType, "email" | "password">;

export type LoginServiceOutputType = { accessToken: string };

