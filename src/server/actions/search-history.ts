"use server";

import { revalidateTag, unstable_cache } from "next/cache";
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { db } from "../db";

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

export async function getSearchHistory(userId: string) {
  return await unstable_cache(
    async () => {
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
    },
    ["search-history"],
    { tags: [`user-search-history-${userId}`] },
  )();
}

type removeSearchHistoryByIdParams = {
  id: string;
  userId: string;
};

export async function removeSearchHistoryById({
  id,
  userId,
}: removeSearchHistoryByIdParams) {
  try {
    const removed = await db.searchHistory.delete({
      where: { id },
    });
    revalidateTag(`user-search-history-${userId}`);
    return removed;
  } catch (error) {
    throw { error };
  }
}
