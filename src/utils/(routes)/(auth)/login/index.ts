import { type loginSchema } from "@/schemas";
import { comparePassword, getUserByEmail } from "@/server/actions/user";
import { type z } from "zod";

export const login = async (data: z.infer<typeof loginSchema>) => {
  const user = await getUserByEmail(data.email);
  if (!user?.emailVerified) {
    throw { error: "email does not exist!" };
  }
  const isCorrectPassword = await comparePassword(
    data.password,
    user.password!,
  );

  if (!isCorrectPassword) {
    throw { error: "wrong password!" };
  }
};
