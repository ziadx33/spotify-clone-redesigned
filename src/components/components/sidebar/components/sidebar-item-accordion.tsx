import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { FaMagnifyingGlass, FaPlus } from "react-icons/fa6";
import { useSidebarSearch } from "./hooks/use-sidebar-search";
import { SearchInput } from "./search-input";
import {
  type MouseEvent,
  type ReactNode,
  useState,
  type KeyboardEvent,
} from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

type SidebarItemAccordionProps<T> = {
  title: string;
  icon: ReactNode;
  items: T[];
  filterKey: keyof T;
  renderItem: (item: T) => ReactNode;
  createLink?: string;
  onCreate?: (value: string) => void;
  customCreateUI?: (
    onCreate: (e: KeyboardEvent, value: string) => void,
  ) => ReactNode;
  isLoading?: boolean;
  loadingPlaceholder?: ReactNode;
};

export function SidebarItemAccordion<T>({
  title,
  icon,
  items,
  filterKey,
  renderItem,
  createLink,
  onCreate,
  customCreateUI,
  isLoading,
  loadingPlaceholder,
}: SidebarItemAccordionProps<T>) {
  const {
    isSearching,
    searchValue,
    filteredItems,
    setIsSearching,
    setSearchValue,
  } = useSidebarSearch(items, filterKey);
  const [isCreating, setIsCreating] = useState(false);

  const toggleSearch = (e: MouseEvent) => {
    e.stopPropagation();
    setIsSearching((prev) => !prev);
  };

  const handleCreateClick = (e: KeyboardEvent, value: string) => {
    e.stopPropagation();
    onCreate?.(value);
    setIsCreating(false);
  };

  return (
    <AccordionItem value={title.toLowerCase()} className="px-2">
      <AccordionTrigger>
        <div className="flex w-full items-center justify-between pr-2">
          {!isSearching ? (
            <div className="flex items-center gap-2 text-xl">
              {icon}
              {title}
            </div>
          ) : (
            <SearchInput value={searchValue} onChange={setSearchValue} />
          )}
          <div className="flex gap-1">
            <button
              onClick={toggleSearch}
              className="grid h-full w-8 place-items-center transition-all duration-300"
            >
              <FaMagnifyingGlass size={13} />
            </button>
            {customCreateUI ? (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  setIsCreating((v) => !v);
                }}
                className={cn(
                  "grid h-full w-8 place-items-center transition-all duration-300",
                  isCreating ? "rotate-45" : "",
                )}
              >
                <FaPlus size={13} />
              </button>
            ) : createLink ? (
              <Link
                href={createLink}
                className="grid h-full w-8 place-items-center transition-all duration-300"
              >
                <FaPlus size={13} />
              </Link>
            ) : null}
          </div>
        </div>
      </AccordionTrigger>
      <AccordionContent>
        {isCreating && customCreateUI?.(handleCreateClick)}
        {isLoading ? loadingPlaceholder : filteredItems.map(renderItem)}
      </AccordionContent>
    </AccordionItem>
  );
}
