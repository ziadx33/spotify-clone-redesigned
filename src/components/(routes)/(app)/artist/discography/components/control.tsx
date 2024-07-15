import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
} from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { BsGrid, BsList } from "react-icons/bs";
import { type FiltersStateType } from "..";
import { type Dispatch, type SetStateAction } from "react";

type ControlProps = {
  filters: FiltersStateType;
  setFilters: Dispatch<SetStateAction<FiltersStateType>>;
};

export function Control({ filters, setFilters }: ControlProps) {
  return (
    <div className="flex items-center gap-2">
      <Select
        value={filters.filterBy}
        onValueChange={(e) => {
          setFilters((v) => ({
            ...v,
            filterBy: e as FiltersStateType["filterBy"],
          }));
        }}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="select a filter" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="albums">Albums</SelectItem>
            <SelectItem value="singles">Singles</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
      <ToggleGroup
        value={filters.viewAs}
        onValueChange={(e) =>
          e
            ? setFilters((v) => ({
                ...v,
                viewAs: e as FiltersStateType["viewAs"],
              }))
            : filters.filterBy
        }
        defaultValue="list"
        type="single"
      >
        <ToggleGroupItem value="list" aria-label="Toggle italic">
          <BsList className="h-4 w-4" />
        </ToggleGroupItem>
        <ToggleGroupItem value="grid" aria-label="Toggle underline">
          <BsGrid className="h-4 w-4" />
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  );
}
