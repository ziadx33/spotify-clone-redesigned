import { baseAPI } from "../api";
import { type SearchResponse } from "@/app/api/(routes)/search/route";

export const getSearchQueryData = async ({ query }: { query: string }) => {
  try {
    const response = await baseAPI.get<SearchResponse>(
      `/api/search?query=${query}`,
    );

    return response.data;
  } catch (error) {
    return null;
  }
};

export type SearchQueryReturn = Awaited<ReturnType<typeof getSearchQueryData>>;
