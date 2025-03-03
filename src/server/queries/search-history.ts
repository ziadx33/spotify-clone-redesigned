import { type SearchHistory } from "@prisma/client";
import { baseAPI } from "../api";

export async function getSearchHistory(
  userId: string,
): Promise<SearchHistory[] | null> {
  try {
    const response = await baseAPI.get<SearchHistory[]>(
      `/api/search-history?userId=${userId}`,
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching search history:", error);
    return null;
  }
}
