import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { type TrackFilters } from "@/types";
import { useState, type Dispatch, type SetStateAction } from "react";

type FiltersSelectProps = {
  setFilters: Dispatch<SetStateAction<TrackFilters>>;
  filters: TrackFilters;
  handleFilterChange: (name: keyof TrackFilters) => void;
};

export function FiltersSelect({
  filters,
  handleFilterChange,
  setFilters,
}: FiltersSelectProps) {
  const [showViewAs, setShowViewAs] = useState(false);
  return (
    <>
      <Select
        value={showViewAs ? filters.viewAs : filters.sortBy}
        onValueChange={(e) => {
          if (["LIST", "COMPACT"].includes(e)) {
            setShowViewAs(true);
            setFilters((data) => ({
              ...data,
              viewAs: e as TrackFilters["viewAs"],
            }));
            return;
          }
          if (e.includes("-")) {
            const valueValues = e.split("-");
            handleFilterChange(valueValues[0] as keyof TrackFilters);
          } else handleFilterChange(e as keyof TrackFilters);
        }}
      >
        <SelectTrigger className="w-[280px]">
          <SelectValue placeholder="custom order" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Sort By</SelectLabel>
            <SelectItem value="custom order">Custom order</SelectItem>
            <SelectItem value={"title"}>Title</SelectItem>
            <SelectItem value="artist">Artist</SelectItem>
            <SelectItem value="album">album</SelectItem>
            <SelectItem value="dateAdded">Date Added</SelectItem>
            <SelectItem value="duration">Duration</SelectItem>
          </SelectGroup>
          <SelectGroup>
            <SelectLabel>View As</SelectLabel>
            <SelectItem value="LIST">List</SelectItem>
            <SelectItem value="COMPACT">Compact</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </>
  );
}
