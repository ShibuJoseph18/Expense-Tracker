import sqlite3 from "sqlite3";
import { open } from "sqlite";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbFilePath = path.join(__dirname, "..", "db", "sqlite.db");
export const db = await open({
  filename: dbFilePath,
  driver: sqlite3.cached.Database,
});

export const initializeTablesAndDefaultData = async () => {
  const sqlPath = path.join(__dirname, "..", "db/sql");

  // ✅ Check if ANY user-defined tables exist in SQLite
  const result = await db.all(`
    SELECT name FROM sqlite_master 
    WHERE type='table' AND name NOT LIKE 'sqlite_%';
  `);

  if (!result || result.length === 0) {
    console.log("⚙️  No tables found. Creating schema and seeding data...");

    const tablesSql = fs.readFileSync(`${sqlPath}/tables.sql`, "utf8");
    await db.exec(tablesSql);
    console.log("✅ Tables created successfully");

    const seedSql = fs.readFileSync(`${sqlPath}/seed.sql`, "utf8");
    await db.exec(seedSql);
    console.log("✅ Seeding finished successfully");
  } else {
    console.log("✅ Database already initialized. Skipping creation.");
  }
};
