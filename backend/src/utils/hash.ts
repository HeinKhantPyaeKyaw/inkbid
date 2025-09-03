import bcrypt from "bcryptjs";

export const hash = (input: string): string => {
  const salt = bcrypt.genSaltSync(10);
  return bcrypt.hashSync(input, salt);
};
