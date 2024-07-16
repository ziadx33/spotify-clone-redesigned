"use server";

import { type z } from "zod";
import { db } from "../db";
import { type registerSchema } from "@/schemas";
import { compare, hash } from "bcrypt";
import { type User } from "@prisma/client";
import { unstable_cache } from "next/cache";
import { cache } from "react";

export const getUserByEmail = async (email: string) => {
  try {
    const user = await db.user.findUnique({
      where: {
        email,
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
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
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
    return updatedUser;
  } catch (error) {
    throw error;
  }
};

export const getUserById = unstable_cache(
  cache(async (id: string) => {
    try {
      const user = await db.user.findUnique({
        where: {
          id,
        },
      });
      return user;
    } catch (error) {
      throw error;
    }
  }),
  ["user", "id"],
);

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

export const getArtistFansFollowing = unstable_cache(
  cache(async ({ followers, artistId }: GetArtistFansFollowingParams) => {
    try {
      const users = await db.user.findMany({
        where: {
          id: {
            not: artistId,
          },
          followers: {
            hasSome: followers,
          },
        },
      });
      return users;
    } catch (error) {
      throw { error };
    }
  }),
);
