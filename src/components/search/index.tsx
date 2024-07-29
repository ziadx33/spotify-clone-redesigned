"use client";

import { useSearchParams } from "next/navigation";
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
      console.log("it's shitting rn so go away");
      const data = await getSearchQueryData({
        query: queryRef.current ?? "",
      });
      return data;
    },
  });
  useSearch({
    onChange: refetch,
    controllers: {
      query: queryRef,
    },
  });
  console.log("idk", !!(!isLoading && data));
  return (
    <div className="flex flex-col p-4">
      {!isLoading && data ? (
        <SearchContent {...data} />
      ) : (
        <Loading className="h-[50rem]" />
      )}
    </div>
  );
}
