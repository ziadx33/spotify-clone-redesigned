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
import { type Playlist } from "@prisma/client";
import { type Dispatch, type SetStateAction } from "react";

type FiltersSelectProps = {
  setFilters?: Dispatch<SetStateAction<TrackFilters>>;
  filters: TrackFilters;
  handleFilterChange?: (name: keyof TrackFilters) => void;
  playlist?: Playlist | null;
};

export function FiltersSelect({ filters, setFilters }: FiltersSelectProps) {
  return (
    <>
      <Select
        value={filters.viewAs}
        onValueChange={(e) => {
          setFilters?.((data) => ({
            ...data,
            viewAs: e as TrackFilters["viewAs"],
          }));
        }}
      >
        <SelectTrigger className="w-[280px]">
          <SelectValue placeholder="custom order" />
        </SelectTrigger>
        <SelectContent>
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
