/* eslint-disable @typescript-eslint/no-unsafe-assignment */
"use client";

import { Button } from "@/components/ui/button";
import { FaPlay } from "react-icons/fa";
import { FaCircleMinus, FaShuffle } from "react-icons/fa6";
import { IoPersonAddOutline } from "react-icons/io5";
import { BsThreeDots } from "react-icons/bs";
import { type Playlist } from "@prisma/client";
import { type TrackFilters } from "@/types";
import { FiltersSelect } from "./filters-select";
import {
  memo,
  useMemo,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";
import { useSession } from "@/hooks/use-session";
import { SearchInput } from "../../components/search-input";
import { AddLibraryButton } from "@/components/components/add-library-button";
import { cn } from "@/lib/utils";
import { RiPlayListAddLine } from "react-icons/ri";
import { useTracks } from "@/hooks/use-tracks";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import {
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  Command,
} from "@/components/ui/command";
import { usePlaylists } from "@/hooks/use-playlists";
import { addPlaylistToTracks } from "@/server/actions/track";
import { toast } from "sonner";

type PlayerProps = {
  filters: TrackFilters;
  setFilters?: Dispatch<SetStateAction<TrackFilters>>;
  handleFilterChange?: (name: keyof TrackFilters) => void;
  setTrackQuery?: Dispatch<SetStateAction<string | null>>;
  playlist?: Playlist | null;
  selectedTracks?: string[];
  setSelectedTracks?: Dispatch<SetStateAction<string[]>>;
};

export function Comp({
  filters,
  playlist,
  setFilters,
  handleFilterChange,
  setTrackQuery,
  selectedTracks,
  setSelectedTracks,
}: PlayerProps) {
  const { data: user } = useSession();
  const isCreatedByUser = user?.user?.id === playlist?.creatorId;

  return (
    <div className="flex w-full items-center">
      <div className="flex w-full items-center justify-between">
        <div
          className={cn(
            "mt-2 flex h-fit w-full justify-between rounded-full px-4 py-3",
            selectedTracks?.length ?? 0 > 0 ? "bg-muted" : "",
          )}
        >
          <div className="flex h-fit w-full">
            {selectedTracks?.length ?? 0 > 0 ? (
              <AddTracksToPlaylist
                playlist={playlist}
                selectedTracksIds={selectedTracks}
                setSelectedTracks={setSelectedTracks}
              />
            ) : (
              <Button size={"icon"} className="mr-4 size-12 rounded-full">
                <FaPlay size={18} />
              </Button>
            )}
            {(selectedTracks?.length ?? 0) < 1 && (
              <Button
                size={"icon"}
                variant="ghost"
                className="size-12 rounded-full"
              >
                <FaShuffle size={22} />
              </Button>
            )}
            {isCreatedByUser ? (
              <Button
                size={"icon"}
                variant="ghost"
                className="size-12 rounded-full"
              >
                <IoPersonAddOutline size={22} />
              </Button>
            ) : (
              <AddLibraryButton
                disabled={!playlist}
                size={50}
                playlist={playlist}
              />
            )}
            <Button
              size={"icon"}
              variant="ghost"
              className="size-12 rounded-full"
            >
              <BsThreeDots size={22} />
            </Button>
          </div>
          <div className="flex w-full items-center justify-end gap-2">
            {selectedTracks?.length ?? 0 > 0 ? (
              <Button
                size={"icon"}
                variant="ghost"
                onClick={() => setSelectedTracks?.([])}
                className="h-full w-8 rounded-full"
              >
                <FaCircleMinus className="size-full" />
              </Button>
            ) : (
              <>
                <SearchInput setTrackQuery={setTrackQuery} />

                <FiltersSelect
                  handleFilterChange={handleFilterChange}
                  filters={filters}
                  setFilters={setFilters}
                />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

type AddTracksToPlaylistProps = {
  playlist?: Playlist | null;
  selectedTracksIds?: string[];
  setSelectedTracks?: Dispatch<SetStateAction<string[]>>;
};

function AddTracksToPlaylist({
  playlist,
  setSelectedTracks,
  selectedTracksIds,
}: AddTracksToPlaylistProps) {
  const { data: tracks, status: tracksStatus } = useTracks();
  const { data: user } = useSession();
  const { data: playlists, status: playlistsStatus } = usePlaylists();
  const userPlaylists = useMemo(() => {
    if (playlistsStatus === "loading" || !user?.user?.id) return [];
    return playlists?.filter(
      (playlist) => playlist.creatorId === user?.user?.id,
    );
  }, [playlists, playlistsStatus, user?.user?.id]);
  const [open, setOpen] = useState(false);
  const playlistSelectHandler = async (value: string) => {
    const selectedTracks =
      tracks?.tracks
        ?.filter((track) => {
          const trackExistance = selectedTracksIds?.includes(track.id);
          return trackExistance && !track.playlists.includes(value);
        })
        .map((track) => track.id) ?? [];
    toast.promise(
      addPlaylistToTracks({
        playlistId: value,
        trackIds: selectedTracks,
      }),
      {
        success: "added tracks successfully",
      },
    );
    setSelectedTracks?.([]);
  };
  return (
    <Popover open={open} onOpenChange={setOpen} modal>
      <PopoverTrigger asChild>
        <Button
          disabled={
            !playlist || [playlistsStatus, tracksStatus].includes("loading")
          }
          size={"icon"}
          variant="ghost"
          className="size-12 rounded-full"
        >
          <RiPlayListAddLine size={22} />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search playlist..." />
          <CommandList>
            <CommandEmpty>No playlist found.</CommandEmpty>
            <CommandGroup>
              {userPlaylists?.map((playlist) => (
                <CommandItem
                  key={playlist.id}
                  value={playlist.id}
                  onSelect={(currentValue) => {
                    void playlistSelectHandler(currentValue);
                    setOpen(false);
                  }}
                >
                  {playlist.title}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

export const Player = memo(Comp);
