"use client";

import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { SearchContent } from "./components/search-content";
import { useSearch } from "@/hooks/use-search";
import { useRef } from "react";
import Loading from "../ui/loading";
import { BrowsePage } from "./components/browse-page";
import { SearchInput } from "./components/search-input";
import { getSearchQueryData } from "@/server/queries/search";

export function Search() {
  const searchParams = useSearchParams();
  const queryRef = useRef(searchParams.get("query") ?? null);
  const { data, isLoading, refetch } = useQuery({
    queryKey: [],
    queryFn: async () => {
      const data = await getSearchQueryData({
        query: queryRef.current ?? "",
      });
      return data;
    },
    enabled: !queryRef.current || queryRef.current !== "",
  });
  useSearch({
    onChange: async ({ query }) => {
      queryRef.current = query ?? queryRef.current;
      await refetch();
    },
    controllers: {
      query: queryRef,
    },
  });
  return (
    <div className="flex h-full flex-col p-4">
      {""}
      <SearchInput />
      {!isLoading ? (
        queryRef.current ? (
          data && <SearchContent query={queryRef.current ?? ""} data={data} />
        ) : (
          <BrowsePage />
        )
      ) : (
        <Loading />
      )}
    </div>
  );
}
