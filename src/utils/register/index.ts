import { sendEmail } from "@/lib/send-email";
import { type registerSchema } from "@/schemas";
import { createPrefrence } from "@/server/actions/prefrence";
import { createUser } from "@/server/actions/user";
import {
  deleteVerificationTokenById,
  generateVerificationToken,
} from "@/server/actions/verification-token";
import { getUser } from "@/server/queries/user";
import { getVerificationTokenByEmail } from "@/server/queries/verification-token";
import { type z } from "zod";

export const register = async (
  data: z.infer<typeof registerSchema> & { origin: string },
) => {
  const user = await getUser({ email: data.email });
  if (!user) {
    const createdUser = await createUser({
      email: data.email,
      name: data.name,
      password: data.password,
    });
    await createPrefrence(createdUser.id);
  }
  let verificationToken = !user
    ? await generateVerificationToken(data.email)
    : await getVerificationTokenByEmail(user.email ?? "");
  if (user && verificationToken) {
    const hasExpired = new Date(verificationToken.expires) < new Date();
    if (hasExpired) await deleteVerificationTokenById(verificationToken.id);
    verificationToken = await generateVerificationToken(data.email);
  }
  const confirmationLink = `${data.origin}/verification-token?token=${verificationToken?.token}`;
  await sendEmail({
    to: data.email,
    from: "hatemziad384@gmail.com",
    subject: "your code",
    html: `your verification link: <a href="${confirmationLink}">Link</a>`,
  });
  return !user
    ? "Registered successfully, we have sent a verification link to your email."
    : "Verification link sent!";
};
