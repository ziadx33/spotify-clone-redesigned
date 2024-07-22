import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useState, type Dispatch, type SetStateAction } from "react";
import { FaMagnifyingGlass } from "react-icons/fa6";

type SearchInputProps = {
  setTrackQuery: Dispatch<SetStateAction<string | null>>;
};

export function SearchInput({ setTrackQuery }: SearchInputProps) {
  const [isSearching, setIsSearching] = useState(false);
  return (
    <div className="flex gap-2">
      {isSearching && (
        <Input
          onChange={(e) =>
            setTrackQuery(e.target.value === "" ? null : e.target.value)
          }
          placeholder="search"
        />
      )}
      <Button
        onClick={() => setIsSearching((v) => !v)}
        size={"icon"}
        variant="ghost"
        className={cn(
          "grid h-10 place-items-center rounded-full p-0",
          isSearching ? "w-12" : "w-10",
        )}
      >
        <FaMagnifyingGlass size={15} />
      </Button>
    </div>
  );
}
