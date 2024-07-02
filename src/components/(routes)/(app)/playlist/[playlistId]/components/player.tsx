/* eslint-disable @typescript-eslint/no-unsafe-assignment */
"use client";

import { Button } from "@/components/ui/button";
import { FaRegArrowAltCircleDown, FaPlay } from "react-icons/fa";
import { FaShuffle } from "react-icons/fa6";
import { IoPersonAddOutline } from "react-icons/io5";
import { BsThreeDots } from "react-icons/bs";
import { type Playlist } from "@prisma/client";
import { type TrackFilters } from "@/types";
import { FiltersSelect } from "./filters-select";
import { type Dispatch, type SetStateAction } from "react";
import { useSession } from "@/hooks/use-session";
import { AddLibraryButton } from "./add-library-button";
import { SearchInput } from "./search-input";

type PlayerProps = {
  id: Playlist["id"];
  filters: TrackFilters;
  setFilters: Dispatch<SetStateAction<TrackFilters>>;
  handleFilterChange: (name: keyof TrackFilters) => void;
  setTrackQuery: Dispatch<SetStateAction<string | null>>;
  playlist: Playlist | null;
};

export function Player({
  filters,
  playlist,
  setFilters,
  handleFilterChange,
  setTrackQuery,
}: PlayerProps) {
  const { data: user } = useSession();
  const isCreatedByUser = user?.user?.id === playlist?.creatorId;

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
        {isCreatedByUser ? (
          <Button
            size={"icon"}
            variant="ghost"
            className="h-16 w-16 rounded-full"
          >
            <IoPersonAddOutline size={32} />
          </Button>
        ) : (
          <AddLibraryButton user={user} playlist={playlist} />
        )}
        <Button
          size={"icon"}
          variant="ghost"
          className="h-16 w-16 rounded-full"
        >
          <BsThreeDots size={32} />
        </Button>
      </div>
      <div className="flex w-full items-center justify-end gap-2">
        <SearchInput setTrackQuery={setTrackQuery} />

        <FiltersSelect
          playlist={playlist}
          handleFilterChange={handleFilterChange}
          filters={filters}
          setFilters={setFilters}
        />
      </div>
    </div>
  );
}
