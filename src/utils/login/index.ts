import { type loginSchema } from "@/schemas";
import { comparePassword } from "@/server/actions/user";
import { getUser } from "@/server/queries/user";
import { type z } from "zod";

export const login = async (data: z.infer<typeof loginSchema>) => {
  const user = await getUser({ email: data.email });
  if (!user?.emailVerified) {
    throw { error: "email does not exist!" };
  }
  const isCorrectPassword = user.password
    ? await comparePassword(data.password, user.password)
    : true;

  if (!isCorrectPassword) {
    throw { error: "wrong password!" };
  }
};
