import dotenv from "dotenv";
dotenv.config({ quiet: true });

interface Config {
  port: number;
  nodeEnv: string;
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
  saltRounds: parseEnvVariableToNumber(process.env.SALT_ROUNDS) || 10,
  jwtSecretKey: process.env.JWT_SECRET_KEY!,
};

export default config;
