import * as z from "zod";

export const registerSchema = z.object({
  name: z.string().regex(/^[A-Za-z ]+$/, "Name must contain only letters"),
  email: z.email(),
  password: z.string(),
  mobile: z.string(),
});
export type RegisterType = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(2).max(25),
});
export type LoginType = z.infer<typeof loginSchema>;
