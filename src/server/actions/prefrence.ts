"use server";

import { db } from "../db";
import { type PrefrenceSliceType } from "@/state/slices/prefrence";
import { type Preference } from "@prisma/client";

export const getPrefrence = async (id: string): Promise<PrefrenceSliceType> => {
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
};

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
    return updatedPrefrence;
  } catch (error) {
    throw { error };
  }
};
