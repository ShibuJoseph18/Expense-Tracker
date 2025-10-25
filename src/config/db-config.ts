import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import config from "./config.js";

// Create better-sqlite3 instance
const sqlite = new Database(config.dbFile, { verbose: () => {} });

// Wrap with Drizzle
const db = drizzle(sqlite);
export default db;
