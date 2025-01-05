"use server";

import { type PrefrenceSliceType } from "@/state/slices/prefrence";
import { db } from "../db";
import { type Preference } from "@prisma/client";
import { revalidateTag, unstable_cache } from "next/cache";

export async function getPrefrence(id: string) {
  return await unstable_cache(
    async (): Promise<PrefrenceSliceType> => {
      try {
        const prefrence = await db.preference.findUnique({
          where: {
            userId: id,
          },
        });
        if (!prefrence) throw "no prefrence";
        return {
          data: prefrence,
          error: null,
          status: "success",
        };
      } catch (error) {
        return {
          data: null,
          error: error as string,
          status: "error",
        };
      }
    },
    ["prefrence"],
    { tags: [`user-prefrence-${id}`] },
  )();
}

export const createPrefrence = async (
  userId: string,
): Promise<PrefrenceSliceType> => {
  try {
    const prefrence = await db.preference.create({
      data: {
        userId,
      },
    });
    return {
      data: prefrence,
      error: null,
      status: "success",
    };
  } catch (error) {
    return {
      data: null,
      error: error as string,
      status: "error",
    };
  }
};

type EditUserPreferenceParams = {
  userId: string;
  data: Partial<Preference>;
};

export const editUserPrefrence = async ({
  data,
  userId,
}: EditUserPreferenceParams) => {
  try {
    const updatedPrefrence = await db.preference.update({
      where: {
        userId,
      },
      data,
    });
    revalidateTag(`user-prefrence-${userId}`);
    return updatedPrefrence;
  } catch (error) {
    throw { error };
  }
};
