import bcrypt from "bcrypt";

export const isValidPassword = async ({
  plainText,
  hash,
}: {
  plainText: string;
  hash: string;
}): Promise<boolean> => {
  return await bcrypt.compare(plainText, hash);
};
