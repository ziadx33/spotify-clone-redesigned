"use server";

import { revalidateTag } from "next/cache";
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
