"use server";

import { unstable_cache } from "next/cache";
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { db } from "../db";
import { cache } from "react";

export async function AddToSearchHistory(
  data: Parameters<(typeof db)["searchHistory"]["create"]>["0"],
) {
  try {
    const created = await db.searchHistory.create(data);
    return created;
  } catch (error) {
    throw { error };
  }
}

export const getSearchHistory = unstable_cache(
  cache(async (userId: string) => {
    try {
      const data = await db.searchHistory.findMany({
        where: {
          userId,
        },
      });
      return data;
    } catch (error) {
      throw { error };
    }
  }),
  ["search-history"],
);

export async function removeSearchHistoryById(id: string) {
  try {
    const removed = await db.searchHistory.delete({
      where: { id },
    });
    return removed;
  } catch (error) {
    throw { error };
  }
}
