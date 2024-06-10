"use server";

import { v4 as uuid } from "uuid";
import { db } from "../db";
import { type VerificationToken } from "@prisma/client";
import { getUserByEmail, updateUserById } from "./user";

export const generateVerificationToken = async (email: string) => {
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
};

export const createVerificationToken = async ({
  email,
  expires,
  token,
}: CreateVerificationToken) => {
  try {
    const verificationToken = await db.verificationToken.create({
      data: {
        email,
        expires,
        token,
      },
    });
    return verificationToken;
  } catch (error) {
    throw error;
  }
};

export const verifyToken = async (token: string) => {
  const existingToken = await getVerificationTokenById(token);
  if (!existingToken) return { error: "Token does not exist!" };

  const hasExpired = new Date(existingToken.expires) < new Date();

  if (hasExpired) return { error: "Token has expired" };

  const existingUser = await getUserByEmail(existingToken.email);

  if (!existingUser) return { error: "Email does not exist!" };

  await updateUserById({
    id: existingUser.id,
    data: { emailVerified: new Date() },
  });

  return { success: "email verified" };
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
