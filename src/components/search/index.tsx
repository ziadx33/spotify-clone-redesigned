"use client";

import { useSearchParams } from "next/navigation";
import { Input } from "../ui/input";
import { useQuery } from "react-query";
import Loading from "../ui/loading";
import { getSearchQueryData } from "@/server/actions/search";
import { SearchContent } from "./components/search-content";
import { useSearch } from "@/hooks/use-search";
import { useRef } from "react";

export function Search() {
  const searchParams = useSearchParams();
  const queryRef = useRef(searchParams.get("query") ?? null);
  const { data, isLoading, refetch } = useQuery({
    queryFn: async () => {
      console.log("stop fucking", queryRef);
      const data = await getSearchQueryData({
        query: queryRef.current ?? "",
      });
      return data;
    },
  });
  const {
    values: { query },
    setQuery,
  } = useSearch({
    debounce: true,
    data: {
      query: "",
    },
    onChange: refetch,
    controllers: {
      query: queryRef,
    },
  });
  return (
    <div className="flex flex-col">
      <Input
        className="z-20 mb-4 w-fit min-w-96"
        placeholder="What do you want to play?"
        value={query}
        onChange={(e) => setQuery({ name: "query", value: e.target.value })}
      />
      {!isLoading && data ? (
        <SearchContent {...data} />
      ) : (
        <Loading className="h-[50rem]" />
      )}
    </div>
  );
}
