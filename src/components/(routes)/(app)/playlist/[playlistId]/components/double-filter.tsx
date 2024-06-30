import { TableHead } from "@/components/ui/table";
import { DEFAULT_TRACK_FILTERS_DATA } from "@/constants";
import { type TrackFilters } from "@/types";
import { useState, type Dispatch, type SetStateAction } from "react";
import { IoIosArrowUp, IoIosArrowDown } from "react-icons/io";
import { FilterButton } from "./filter-button";

type DoubleFilterProps = {
  setFilters: Dispatch<SetStateAction<TrackFilters>>;
  filters: TrackFilters;
  handleFilterChange: (e: keyof TrackFilters) => void;
};

export function DoubleFilter({
  setFilters,
  filters,
  handleFilterChange,
}: DoubleFilterProps) {
  const [currentFilter, setCurrentFilter] = useState<"title" | "artist" | null>(
    "title",
  );
  const handleTitleChange = () => {
    setFilters((filter) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const currentFilterCur =
        filter.title === "DSC"
          ? "artist"
          : filter.artist === "DSC"
            ? null
            : currentFilter ?? "title";
      if (currentFilterCur !== currentFilter)
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        setCurrentFilter(currentFilterCur);
      return {
        ...DEFAULT_TRACK_FILTERS_DATA,
        title:
          currentFilterCur !== "title"
            ? null
            : filter.title === "ASC"
              ? "DSC"
              : "ASC",
        artist:
          currentFilterCur !== "artist"
            ? null
            : filter.artist === "ASC"
              ? "DSC"
              : "ASC",
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        sortBy: currentFilterCur ?? "custom order",
      };
    });
  };
  return (
    <TableHead className="w-96">
      {" "}
      {filters.viewAs === "LIST" ? (
        <button onClick={handleTitleChange} className="flex items-center gap-1">
          {filters.sortBy === "artist" ? "Artist" : "Title"}
          {(filters.title ?? filters.artist) &&
            (filters.title === "ASC" || filters.artist === "ASC" ? (
              <IoIosArrowUp className="text-primary" size={15} />
            ) : (
              <IoIosArrowDown className="text-primary" size={15} />
            ))}
        </button>
      ) : (
        <>
          <FilterButton
            filters={filters}
            handleFilterChange={handleFilterChange}
            setFilters={setFilters}
            title="Title"
            propertyName="title"
            className="w-32"
          />
          <FilterButton
            filters={filters}
            handleFilterChange={handleFilterChange}
            setFilters={setFilters}
            title="Artist"
            propertyName="artist"
            className="w-32"
          />
        </>
      )}
    </TableHead>
  );
}
