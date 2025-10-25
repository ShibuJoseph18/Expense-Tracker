import dotenv from "dotenv";
import type { ZodNumber } from "zod/v3";
dotenv.config({ quiet: true });

interface Config {
  port: number;
  nodeEnv: string;
  dbFile: string;
  saltRounds: number;
  jwtSecretKey: string;
}

function parseEnvVariableToNumber(value: string | undefined | number): number {
  const n = Number(value);
  if (Number.isNaN(n)) {
    return 0;
  }
  return n;
}

const config: Config = {
  port: parseEnvVariableToNumber(process.env.PORT) || 3000,
  nodeEnv: process.env.NODE_ENV || "development",
  dbFile: process.env.DATABASE_URL!,
  saltRounds: parseEnvVariableToNumber(process.env.SALT_ROUNDS) || 10,
  jwtSecretKey: process.env.JWT_SECRET_KEY!,
};

export default config;
