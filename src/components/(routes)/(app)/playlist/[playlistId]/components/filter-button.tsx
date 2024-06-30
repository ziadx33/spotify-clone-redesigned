import { TableHead } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { type TrackFilters } from "@/types";
import { type ReactNode, type Dispatch, type SetStateAction } from "react";
import { IoIosArrowUp, IoIosArrowDown } from "react-icons/io";

type FilterButtonProps = {
  filters: TrackFilters;
  setFilters: Dispatch<SetStateAction<TrackFilters>>;
  handleFilterChange: (name: keyof TrackFilters) => void;
  propertyName: keyof TrackFilters;
  title: ReactNode;
  className?: string;
};

export function FilterButton({
  handleFilterChange,
  title,
  filters,
  propertyName,
  className,
}: FilterButtonProps) {
  return (
    <TableHead className="w-">
      <button
        onClick={() => handleFilterChange(propertyName)}
        className={cn("flex w-36 items-center gap-1 capitalize", className)}
      >
        {title}
        {filters[propertyName] &&
          (filters[propertyName] === "ASC" ? (
            <IoIosArrowUp className="text-primary" size={15} />
          ) : (
            <IoIosArrowDown className="text-primary" size={15} />
          ))}
      </button>
    </TableHead>
  );
}
