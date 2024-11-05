import { sendEmail } from "@/lib/send-email";
import { type registerSchema } from "@/schemas";
import { createUser, getUserByEmail } from "@/server/actions/user";
import {
  deleteVerificationTokenById,
  generateVerificationToken,
  getVerificationTokenByEmail,
} from "@/server/actions/verification-token";
import { type z } from "zod";

export const register = async (
  data: z.infer<typeof registerSchema> & { origin: string },
) => {
  const user = await getUserByEmail(data.email);
  if (!user) {
    await createUser({
      email: data.email,
      name: data.name,
      password: data.password,
    });
  }
  let verificationToken = !user
    ? await generateVerificationToken(data.email)
    : await getVerificationTokenByEmail(user.email);
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
