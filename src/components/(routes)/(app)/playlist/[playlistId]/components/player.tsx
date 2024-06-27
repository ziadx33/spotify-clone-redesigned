"use client";

import { Button } from "@/components/ui/button";
import { FaRegArrowAltCircleDown, FaPlay } from "react-icons/fa";
import { FaMagnifyingGlass, FaShuffle } from "react-icons/fa6";
import { IoPersonAddOutline } from "react-icons/io5";
import { BsList, BsThreeDots } from "react-icons/bs";
import { type Playlist } from "@prisma/client";
import { usePlaylist } from "@/hooks/use-playlist";
import { enumParser } from "@/utils/enum-parser";

type PlayerProps = {
  id: Playlist["id"];
};

export function Player({ id }: PlayerProps) {
  const { data: playlist } = usePlaylist(id);
  return (
    <div className="flex items-center justify-between">
      <div className="flex h-fit w-full py-6">
        <Button size={"icon"} className="mr-4 h-16 w-16 rounded-full">
          <FaPlay size={20} />
        </Button>
        <Button
          size={"icon"}
          variant="ghost"
          className="h-16 w-16 rounded-full"
        >
          <FaShuffle size={30} />
        </Button>
        <Button
          size={"icon"}
          variant="ghost"
          className="h-16 w-16 rounded-full"
        >
          <FaRegArrowAltCircleDown size={32} />
        </Button>
        <Button
          size={"icon"}
          variant="ghost"
          className="h-16 w-16 rounded-full"
        >
          <IoPersonAddOutline size={32} />
        </Button>
        <Button
          size={"icon"}
          variant="ghost"
          className="h-16 w-16 rounded-full"
        >
          <BsThreeDots size={32} />
        </Button>
      </div>
      <div className="flex items-center">
        <Button
          size={"icon"}
          variant="ghost"
          className="h-10 w-10 rounded-full"
        >
          <FaMagnifyingGlass size={15} />
        </Button>

        <Button variant="ghost" className="rounded-full">
          {enumParser(playlist?.sortBy)}
          <BsList size={15} className="ml-2" />
        </Button>
      </div>
    </div>
  );
}
