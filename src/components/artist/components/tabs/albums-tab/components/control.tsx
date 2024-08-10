import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { BsGrid, BsList } from "react-icons/bs";
import { type Dispatch, type SetStateAction } from "react";
import { type FiltersStateType } from "../albums-tab";

type ControlProps = {
  filters: FiltersStateType;
  setFilters: Dispatch<SetStateAction<FiltersStateType>>;
};

export function Control({ filters, setFilters }: ControlProps) {
  return (
    <div className="flex w-fit items-center justify-start gap-2">
      <ToggleGroup
        value={filters.viewAs}
        onValueChange={(e) =>
          e
            ? setFilters((v) => ({
                ...v,
                viewAs: e as FiltersStateType["viewAs"],
              }))
            : filters.viewAs
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
