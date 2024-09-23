import { sendEmail } from "@/lib/send-email";
import { type registerSchema } from "@/schemas";
import { createUser, getUserByEmail } from "@/server/actions/user";
import { generateVerificationToken } from "@/server/actions/verification-token";
import { type z } from "zod";

export const register = async (
  data: z.infer<typeof registerSchema> & { origin: string },
) => {
  const user = await getUserByEmail(data.email);
  if (user) throw "user already exists";
  await createUser({
    email: data.email,
    name: data.name,
    password: data.password,
  });
  const verificationToken = await generateVerificationToken(data.email);
  const confirmationLink = `${data.origin}/verification-token?token=${verificationToken.token}`;
  await sendEmail({
    to: data.email,
    from: "hatemziad384@gmail.com",
    subject: "your code",
    html: `your verification link: <a href="${confirmationLink}">Link</a>`,
  });
};
