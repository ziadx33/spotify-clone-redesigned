"use server";

import { type z } from "zod";
import { db } from "../db";
import { type registerSchema } from "@/schemas";
import { compare, hash } from "bcrypt";
import { type $Enums, type User } from "@prisma/client";
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

export const getArtistById = unstable_cache(
  cache(async (id: string) => {
    try {
      const user = await db.user.findUnique({
        where: {
          id,
        },
      });
      console.log("shutup lil user", user);
      return user;
    } catch (error) {
      throw error;
    }
  }),
  ["user-unique", "id"],
);

export const getUserByIds = unstable_cache(
  cache(async (ids: string[]) => {
    try {
      const users = await db.user.findMany({
        where: {
          id: {
            in: ids,
          },
        },
      });
      return users;
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
  ["artist-fans-users"],
);

export const getFollowedArtists = unstable_cache(
  cache(async ({ userId }: { userId: string }) => {
    try {
      const users = await db.user.findMany({
        where: {
          followers: {
            has: userId,
          },
          type: "ARTIST",
        },
      });
      return users;
    } catch (error) {
      throw { error };
    }
  }),
  ["followed-artists"],
);

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
      console.log("5alas", users, amount);
    }

    return users;
  } catch (error) {
    throw { error };
  }
};

export const getPopularUsers = unstable_cache(
  cache(async ({ type }: { type: $Enums.GENRES }) => {
    try {
      const users = await db.user.findMany({
        where: {
          genres: {
            has: type,
          },
        },
        orderBy: {
          followers: "desc",
        },
        take: 30,
      });

      return users;
    } catch (error) {
      throw { error };
    }
  }),
  ["popular-users", "type"],
);
