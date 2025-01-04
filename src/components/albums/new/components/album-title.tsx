import { type Playlist } from "@prisma/client";
import { type ChangeEvent, type Dispatch, type SetStateAction } from "react";

interface AlbumTitleProps {
  data: Omit<Playlist, "id">;
  setData: Dispatch<SetStateAction<Omit<Playlist, "id">>>;
}

export function AlbumTitle({ data, setData }: AlbumTitleProps) {
  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setData((prev) => ({
      ...prev,
      title: event.target.value,
    }));
  };

  return (
    <input
      type="text"
      value={data.title}
      onChange={handleInputChange}
      className="mb-5 w-[59rem] overflow-visible border-none bg-transparent text-start text-6xl font-bold outline-none"
      placeholder="Enter album title"
    />
  );
}
