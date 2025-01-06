"use server";

import { v4 as uuid } from "uuid";
import { db } from "../db";
import { type $Enums, type User, type VerificationToken } from "@prisma/client";
import { getUserByEmail, updateUserById } from "./user";
import { unstable_cache } from "next/cache";

export const generateVerificationToken = async (
  email: string,
  type?: $Enums.TOKEN_TYPE,
) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
  const token = uuid();
  const expires = new Date(new Date().getTime() + 3600 * 1000);

  const existingToken = await getVerificationTokenByEmail(email);

  if (existingToken) {
    await deleteVerificationTokenById(existingToken.id);
  }

  const verificationToken = await createVerificationToken({
    email,
    token,
    expires,
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    type,
  });

  return verificationToken;
};

export const getVerificationTokenByEmail = async (email: string) => {
  try {
    const verificationToken = await db.verificationToken.findFirst({
      where: {
        email,
      },
    });
    return verificationToken;
  } catch (error) {
    throw error;
  }
};

export const deleteVerificationTokenById = async (id: string) => {
  try {
    const verificationToken = await db.verificationToken.delete({
      where: {
        id,
      },
    });
    return verificationToken;
  } catch (error) {
    throw error;
  }
};

type CreateVerificationToken = {
  email: string;
  expires: VerificationToken["expires"];
  token: VerificationToken["token"];
  type?: VerificationToken["type"];
};

export const createVerificationToken = async ({
  email,
  expires,
  token,
  type,
}: CreateVerificationToken) => {
  try {
    const verificationToken = await db.verificationToken.create({
      data: {
        email,
        expires,
        token,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        type: type ?? "RESET_PASSWORD",
      },
    });
    return verificationToken;
  } catch (error) {
    throw error;
  }
};

export const verifyToken = async (token: string, type?: $Enums.TOKEN_TYPE) => {
  const existingToken = await getVerificationTokenById(token);
  if (!existingToken) return { error: "Token does not exist!" };
  if (type && existingToken.type !== type)
    return { error: "Invalid token type!" };

  const hasExpired = new Date(existingToken.expires) < new Date();

  if (hasExpired) return { error: "Token has expired" };

  const existingUser = await getUserByEmail(existingToken.email);

  if (!existingUser) return { error: "Email does not exist!" };

  await updateUserById({
    id: existingUser.id,
    data: { emailVerified: new Date() },
  });

  return { success: "email verified", data: existingUser };
};

export const getVerificationTokenById = async (token: string) => {
  try {
    const verificationToken = await db.verificationToken.findUnique({
      where: {
        token,
      },
    });
    return verificationToken;
  } catch (error) {
    throw error;
  }
};

type getUserByIdParams = {
  id?: string;
  type?: User["type"];
};

export async function getUserById({ id, type }: getUserByIdParams) {
  return await unstable_cache(
    async () => {
      try {
        const user = await db.user.findUnique({
          where: { id, type },
        });
        return user;
      } catch (error) {
        throw { error };
      }
    },
    [`user-id-${id}`],
    { tags: [`user-${id}`] },
  )();
}
