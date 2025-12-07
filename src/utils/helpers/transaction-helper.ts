import { db } from "../../config/db-config.js";

export const atomicTransaction = async (cb) => {
  await db.run("BEGIN");
  try {
    const result = await cb();
    await db.run("COMMIT");
    return result;
  } catch (error) {
    await db.run("ROLLBACK");
    throw error;
  }
};
