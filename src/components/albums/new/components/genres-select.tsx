import { enumParser } from "@/utils/enum-parser";
import { type $Enums, type Playlist } from "@prisma/client";
import { type Dispatch, type SetStateAction } from "react";
import { GenresSelectButton } from "./genres-select-button";
import { Button } from "@/components/ui/button";
import { FaX } from "react-icons/fa6";

type GenresSelectProps = {
  data: Omit<Playlist, "id">;
  setData: Dispatch<SetStateAction<Omit<Playlist, "id">>>;
};

export function GenresSelect({ data, setData }: GenresSelectProps) {
  const removeGenre = (genre: $Enums.GENRES) =>
    setData((prev) => ({
      ...prev,
      genres: prev.genres.filter((g) => g !== genre),
    }));
  return (
    <div className="flex flex-wrap gap-1">
      {(data.genres as string[]).map((genre) => (
        <Button
          key={genre}
          onClick={() => removeGenre(genre as $Enums.GENRES)}
          className="text-md group relative overflow-hidden rounded-full px-4 py-0.5"
          variant="outline"
        >
          {enumParser(genre)}
          <div className="absolute grid size-full place-items-center bg-background bg-opacity-90 opacity-0 transition-opacity group-hover:opacity-100">
            <FaX />
          </div>
        </Button>
      ))}
      <GenresSelectButton data={data} setData={setData} />
    </div>
  );
}
