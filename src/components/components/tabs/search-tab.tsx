"use client";

import { SlMagnifier } from "react-icons/sl";
import { Tab } from "./tab";
import { useSearch } from "@/hooks/use-search";

export function SearchTab() {
  const {
    values: { query },
    setQuery,
  } = useSearch({
    debounce: true,
    data: {
      query: "",
    },
  });

  return (
    <Tab
      title="Search"
      Icon={SlMagnifier}
      gap={12}
      iconSize={20}
      href={"/search"}
      alwaysCurrentContent
      currentContent={
        <input
          defaultValue={query}
          onChange={(e) => setQuery({ name: "query", value: e.target.value })}
          className="h-full w-full bg-transparent p-0 text-sm font-normal text-muted-foreground focus:outline-none"
          placeholder="Search..."
        />
      }
    />
  );
}
