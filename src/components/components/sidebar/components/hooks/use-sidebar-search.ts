import { useState } from "react";

export function useSidebarSearch<T>(items: T[], filterKey: keyof T) {
  const [isSearching, setIsSearching] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const filteredItems = items.filter((item) =>
    String(item[filterKey]).toLowerCase().includes(searchValue.toLowerCase()),
  );

  return {
    isSearching,
    searchValue,
    filteredItems,
    setIsSearching,
    setSearchValue,
  };
}
