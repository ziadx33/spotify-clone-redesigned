import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { type Dispatch, type SetStateAction, useState } from "react";
import { FaMagnifyingGlass } from "react-icons/fa6";

type SearchInputProps = {
  setTrackQuery?: (
    query: string | null,
  ) => void | Dispatch<SetStateAction<string | null>>;
  reverse?: boolean;
  value?: string | null;
};

export function SearchInput({
  setTrackQuery,
  reverse,
  value,
}: SearchInputProps) {
  const [isSearching, setIsSearching] = useState(false);

  return (
    <div
      className={cn(
        "flex items-center gap-2",
        reverse ? "flex-row-reverse" : "",
      )}
    >
      {isSearching && (
        <Input
          defaultValue={value ?? ""}
          autoFocus
          onChange={(e) =>
            setTrackQuery?.(e.target.value === "" ? null : e.target.value)
          }
          placeholder="Search"
          className="w-72"
        />
      )}
      <Button
        onClick={() => setIsSearching((v) => !v)}
        size="icon"
        variant="ghost"
        className="grid place-items-center rounded-full p-0"
      >
        <FaMagnifyingGlass size={15} />
      </Button>
    </div>
  );
}
