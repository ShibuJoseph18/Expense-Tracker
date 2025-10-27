import sqlite3 from "sqlite3";
import { open } from "sqlite";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbFilePath = path.join(__dirname, "..", "db", "sqlite.db");

export let db: any;
(async () => {
  db = await open({
    filename: dbFilePath,
    driver: sqlite3.cached.Database,
  });

  const sqlPath = path.join(__dirname, "..", "db", "tables.sql");
  const sql = fs.readFileSync(sqlPath, "utf8");
  await db.exec(sql);
  console.log("✅ Tables created successfully");
})();
