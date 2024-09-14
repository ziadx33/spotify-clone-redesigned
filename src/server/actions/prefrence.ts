"use server";

import { unstable_cache } from "next/cache";
import { cache } from "react";
import { db } from "../db";
import { type PrefrenceSliceType } from "@/state/slices/prefrence";
import { type Preference } from "@prisma/client";

export const getPrefrence = unstable_cache(
  cache(async (id: string): Promise<PrefrenceSliceType> => {
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
  }),
  ["user-prefrence"],
);

type EditUserPreferenceParams = {
  error: string | null;
  userId: string;
  data: Partial<Preference>;
  type: "push" | "set";
};

export const editUserPrefrence = async ({
  data,
  userId,
  error,
  type,
}: EditUserPreferenceParams) => {
  try {
    if (error) {
      const createdPreference = await db.preference.create({
        data: {
          ...data,
          userId,
        },
      });
      return createdPreference;
    }

    const updatedData = Object.keys(data).reduce(
      (acc, key) => {
        const value = data[key as keyof typeof data];
        if (Array.isArray(value)) {
          acc[key] = { [type]: value };
        } else {
          acc[key] = value;
        }
        return acc;
      },
      {} as Record<string, unknown>,
    );

    const editedPreference = await db.preference.update({
      where: {
        userId: userId,
      },
      data: updatedData,
    });
    return editedPreference;
  } catch (error) {
    throw { error };
  }
};
