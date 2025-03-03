"use server";

import { type z } from "zod";
import { db } from "../db";
import { type registerSchema } from "@/schemas";
import { compare, hash } from "bcrypt";
import { type User } from "@prisma/client";
import { revalidateTag } from "next/cache";
import bcrypt from "bcrypt";

export const deleteUserById = async (id: string) => {
  try {
    const user = await db.user.delete({
      where: {
        id,
      },
    });
    return user;
  } catch (err) {
    throw { error: err };
  }
};

export const createUser = async (data: z.infer<typeof registerSchema>) => {
  try {
    const createdUser = await db.user.create({
      data: {
        ...data,
        password: await hash(data.password, 10),
      },
    });
    return createdUser;
  } catch (err) {
    throw { error: err };
  }
};

export const updateUserById = async ({
  id,
  data,
}: {
  id: string;
  data: Partial<User>;
}) => {
  try {
    const updatedUser = await db.user.update({
      where: {
        id,
      },
      data,
    });
    revalidateTag(`user-${id}`);
    return updatedUser;
  } catch (error) {
    throw error;
  }
};

export const comparePassword = async (
  firstPass: string,
  secondPass: string,
) => {
  const comparison = await compare(firstPass, secondPass);
  return comparison;
};

export const hashPassword = async (password: string, salt = 10) => {
  return await bcrypt.hash(password, salt);
};
