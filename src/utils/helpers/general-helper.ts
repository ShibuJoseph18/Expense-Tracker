import z from "zod";

export const validateIntegerParams = z.coerce.number().int().positive();