import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { enumParser } from "@/utils/enum-parser";
import { $Enums, type Playlist } from "@prisma/client";
import { type Dispatch, type SetStateAction, useState } from "react";
import { FaPlus } from "react-icons/fa";

type GenresSelectButtonProps = {
  setData: Dispatch<SetStateAction<Omit<Playlist, "id">>>;
  data: Omit<Playlist, "id">;
};

export function GenresSelectButton({ setData, data }: GenresSelectButtonProps) {
  const genres = Object.keys($Enums.GENRES).filter(
    (genre) => !data.genres.includes(genre as $Enums.GENRES),
  );
  const [open, setOpen] = useState(false);
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button className="text-md rounded-full px-4 py-0.5" variant="outline">
          <FaPlus />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search genre..." className="h-9" />
          <CommandList>
            <CommandEmpty>You can&apos;t add more genres.</CommandEmpty>
            <CommandGroup>
              {genres.map((genre) => (
                <CommandItem
                  key={genre}
                  value={genre}
                  onSelect={(currentValue) => {
                    setData((prev) => ({
                      ...prev,
                      genres: [...prev.genres, currentValue as $Enums.GENRES],
                    }));
                    setOpen(false);
                  }}
                >
                  {enumParser(genre)}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
