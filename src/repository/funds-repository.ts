import { db } from "../config/db-config.js";
import type {
  CreateFundRepoInput,
  Fund,
  UpdateFundRepoInput,
  GetFundByUserIdAndNameInput,
  GetFund,
} from "../types/funds-types.js";

export const createFundRepo = async (
  fund: CreateFundRepoInput
): Promise<number | undefined> => {
  const insertFund = await db.run(
    `
       INSERT INTO funds
       (user_id, name, amount, category_id, subcategory_id)
       VALUES($user_id, $name, $amount, $category_id, $subcategory_id)
        `,
    {
      $user_id: fund.user_id,
      $name: fund.name,
      $amount: fund.amount,
      $category_id: fund.category_id,
      $subcategory_id: fund.subcategory_id,
    }
  );

  if (!insertFund.changes || !insertFund.lastID) {
    return undefined;
  }

  return insertFund.lastID;
};

export const updateFundRepo = async (
  fund: UpdateFundRepoInput
): Promise<Boolean> => {
  // Construct base params
  const params: Record<string, string | number | undefined> = {
    $id: fund.id,
    $user_id: fund.user_id,
    $name: fund.name,
    $amount: fund.amount,
  };

  let updateColumns: string[] = [];
  //If name is provided, add name clause
  if (fund.name !== undefined) {
    updateColumns.push("name = $name");
    params.$name = fund.name;
  }

  //If amount is provided, add amount clause
  if (fund.amount !== undefined) {
    updateColumns.push("amount = amount + $amount");
    params.$amount = fund.amount;
  }

  // Construct base query
  let sql = `
    UPDATE funds
    SET ${updateColumns.join(",")}
    WHERE deleted = 0 
    AND id = $id
    AND user_id = $user_id 
    `;

  const updateFund = await db.run(sql, params);

  return updateFund.changes ? true : false;
};

export const getFund = async (fund: GetFund): Promise<Fund | undefined> => {
  let sql = `
  SELECT * FROM funds
  WHERE id = $id
  AND $user_id = $user_id
  AND deleted = 0
  `;

  const params: Record<string, number> = {
    $id: fund.id,
    $user_id: fund.user_id,
  };

  const existingFund = await db.get(sql, params);

  return existingFund;
};

export const getFundByUserIdAndName = async (
  fund: GetFundByUserIdAndNameInput
): Promise<Fund | undefined> => {
  let sql = `
  SELECT * FROM funds
  WHERE name = $name
  AND user_id = $user_id
  AND deleted = 0
  `;

  const params = {
    $name: fund.name,
    $user_id: fund.user_id,
  };

  const existingFund = await db.get(sql, params);

  return existingFund;
};
