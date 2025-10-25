import { migrate } from "drizzle-orm/better-sqlite3/migrator";
import db from "./config/db-config.js";

export function initDB() {
  console.log("Running migrations 🔃");
  migrate(db, { migrationsFolder: "./drizzle" });
  console.log("Migrations complete ✅");
}
