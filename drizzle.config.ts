import { defineConfig } from "drizzle-kit";
import config from "./src/config/config";

export default defineConfig({
  schema: "./src/schemas",
  out: "./drizzle",
  dialect: "sqlite",
  dbCredentials: {
    url: config.dbFile, // path to local DB file
  },
});
