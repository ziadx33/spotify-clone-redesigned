/* eslint-disable @typescript-eslint/no-unsafe-assignment */
"use client";

import { Button } from "@/components/ui/button";
import { FaPause, FaPlay } from "react-icons/fa";
import { FaCircleMinus } from "react-icons/fa6";
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
import { QueuePlayButton } from "@/components/queue-play-button";
import { ShuffleButton } from "./shuffle-button";
import { PlaylistDropdown } from "@/components/dropdowns/playlist-dropdown";
import { ExploreButton } from "./explore-button";
import { useUserData } from "@/hooks/use-user-data";
import { useIsMobile } from "@/hooks/use-mobile";

type PlayerProps = {
  filters: TrackFilters;
  setFilters?: Dispatch<SetStateAction<TrackFilters>>;
  handleFilterChange?: (name: keyof TrackFilters) => void;
  setTrackQuery?: Dispatch<SetStateAction<string | null>>;
  playlist?: Playlist | null;
  selectedTracks?: string[];
  setSelectedTracks?: Dispatch<SetStateAction<string[]>>;
  queueTypeId?: string;
  showExploreButton?: boolean;
  disabled?: boolean;
};

export function Comp({
  filters,
  playlist,
  setFilters,
  handleFilterChange,
  setTrackQuery,
  selectedTracks,
  setSelectedTracks,
  queueTypeId,
  showExploreButton,
  disabled,
}: PlayerProps) {
  const isMobile = useIsMobile();
  const user = useUserData();
  const isCreatedByUser = user?.id === playlist?.creatorId;

  return (
    <div className="flex w-full items-center">
      <div className="flex w-full items-center justify-between">
        <div
          className={cn(
            "mt-2 flex h-fit w-full justify-between  rounded-full py-3 lg:px-4",
            selectedTracks?.length ?? 0 > 0 ? "bg-muted" : "",
          )}
        >
          <div className="flex h-fit w-full max-lg:justify-between [&>*]:flex [&>*]:gap-1">
            <div>
              {showExploreButton && <ExploreButton playlist={playlist} />}
              {selectedTracks?.length ?? 0 > 0 ? (
                <AddTracksToPlaylist
                  playlist={playlist}
                  selectedTracksIds={selectedTracks}
                  setSelectedTracks={setSelectedTracks}
                />
              ) : (
                <QueuePlayButton
                  disabled={disabled}
                  queueTypeId={queueTypeId}
                  isCurrent={!!queueTypeId}
                  size={"icon"}
                  className="mr-2 size-12 rounded-full"
                  playlist={playlist}
                  noDefPlaylist
                >
                  {(isPlaying) =>
                    !isPlaying ? <FaPlay size={18} /> : <FaPause size={18} />
                  }
                </QueuePlayButton>
              )}
              {(selectedTracks?.length ?? 0) < 1 && (
                <ShuffleButton disabled={disabled} playlist={playlist} />
              )}
            </div>
            <div>
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
                  disabled={!playlist || disabled}
                  size={50}
                  playlist={playlist}
                />
              )}
              <PlaylistDropdown
                disabled={disabled}
                playlist={playlist}
                asChild={false}
              >
                <Button
                  size={"icon"}
                  variant="ghost"
                  className="size-12 rounded-full"
                >
                  <BsThreeDots size={22} />
                </Button>
              </PlaylistDropdown>
            </div>
          </div>
          {!isMobile && (
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
                  <SearchInput
                    disabled={disabled}
                    setTrackQuery={setTrackQuery}
                  />

                  <FiltersSelect
                    disabled={disabled}
                    handleFilterChange={handleFilterChange}
                    filters={filters}
                    setFilters={setFilters}
                  />
                </>
              )}
            </div>
          )}
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
  const {
    data: { data: tracks, status: tracksStatus },
  } = useTracks();
  const user = useUserData();
  const {
    data: { data: playlists, status: playlistsStatus },
  } = usePlaylists();
  const userPlaylists = useMemo(() => {
    if (playlistsStatus === "loading" || !user?.id) return [];
    return playlists?.filter((playlist) => playlist.creatorId === user?.id);
  }, [playlists, playlistsStatus, user?.id]);
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
