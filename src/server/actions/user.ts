"use server";

import { type z } from "zod";
import { db } from "../db";
import { type registerSchema } from "@/schemas";
import { compare, hash } from "bcrypt";
import { type $Enums, type User } from "@prisma/client";
import { revalidateTag, unstable_cache } from "next/cache";
import { cache } from "react";
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

type GetArtistFansFollowingParams = {
  followers: string[];
  artistId: string;
};

export const getUsersBySearchQuery = async ({
  query,
  amount,
  type,
  restartLength,
}: {
  query: string;
  amount?: number;
  type?: $Enums.USER_TYPE;
  restartLength?: number;
}) => {
  try {
    let users = await db.user.findMany({
      where: {
        name: {
          contains: query,
          mode: "insensitive",
        },
        type,
      },
      take: amount,
    });

    if (users.length === 0 || (restartLength ?? 0) >= users.length) {
      const firstUser = users.length > 0 ? (users as [User])[0] : false;
      users = [
        firstUser,
        ...(await db.user.findMany({ take: amount })).filter(
          (user) => user.id !== (firstUser ? firstUser.id : null),
        ),
      ].filter((v) => v) as User[];
    }

    return users;
  } catch (error) {
    throw { error };
  }
};

export const hashPassword = async (password: string, salt = 10) => {
  return await bcrypt.hash(password, salt);
};
