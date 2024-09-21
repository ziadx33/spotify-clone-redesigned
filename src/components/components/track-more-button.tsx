import { type Playlist, type Track } from "@prisma/client";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { BsPlus, BsShare, BsThreeDots, BsTrash } from "react-icons/bs";
import {
  MdAddToQueue,
  MdMusicNote,
  MdOutlineLibraryMusic,
} from "react-icons/md";
import { useSession } from "@/hooks/use-session";
import { useDispatch } from "react-redux";
import {
  addTrackToPlaylist,
  removeTrackFromPlaylist,
} from "@/state/slices/tracks";
import {
  type ReactNode,
  useMemo,
  useState,
  type Dispatch,
  type SetStateAction,
  type MouseEventHandler,
} from "react";
import {
  addTrackToPlaylistToDB,
  removeTrackFromPlaylistDB,
} from "@/server/actions/track";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import {
  CommandInput,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  Command,
  CommandList,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import { RiArrowRightSLine } from "react-icons/ri";
import { usePlaylists } from "@/hooks/use-playlists";
import { revalidate } from "@/server/actions/revalidate";
import { type AppDispatch } from "@/state/store";

type TrackMoreButtonProps = {
  playlist?: Playlist | null;
  track?: Track | null;
  setOpened?: Dispatch<SetStateAction<boolean>>;
  setShowMoreButton?: Dispatch<SetStateAction<boolean>>;
  className?: string;
};

export function TrackMoreButton({
  playlist,
  track,
  setOpened,
  setShowMoreButton,
  className,
}: TrackMoreButtonProps) {
  const { data: user } = useSession();
  const isInUserPlaylist = playlist?.creatorId === user?.user?.id;
  const router = useRouter();
  return (
    <DropdownMenu onOpenChange={() => setOpened?.((v) => !v)}>
      <DropdownMenuTrigger
        onClick={(e) => e.stopPropagation()}
        className={cn("size-fit border-none bg-transparent p-0", className)}
      >
        <BsThreeDots size={20} />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="mr-2 w-80">
        <AddToPlaylist track={track} />
        {isInUserPlaylist && (
          <RemoveFromPlaylistButton
            playlists={track?.playlists ?? []}
            setShowMoreButton={setShowMoreButton}
            setOpened={setOpened}
            trackId={track?.id ?? ""}
            playlistId={playlist?.id ?? ""}
          />
        )}
        <DropdownMenuItem
          onClick={(e) => e.stopPropagation()}
          className="flex h-10 items-center gap-2"
        >
          <MdAddToQueue size={20} />
          Add to queue
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={(e) => e.stopPropagation()} className="h-10">
          <button
            onClick={() => {
              router.push(`/artist/${track?.authorId}`);
              setShowMoreButton?.(false);
            }}
            className="flex w-full cursor-default items-center gap-2"
          >
            <MdMusicNote size={20} />
            Go to Artist
          </button>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={(e) => e.stopPropagation()} className="h-10">
          <button
            onClick={() => {
              router.push(`/playlist/${track?.albumId}`);
              setShowMoreButton?.(false);
            }}
            className="flex w-full cursor-default items-center gap-2"
          >
            <MdOutlineLibraryMusic size={20} />
            Go to Album
          </button>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={async (e) => {
            e.stopPropagation();
            await navigator.clipboard.writeText(
              `${location.origin}/playlist/${track?.albumId}`,
            );
            toast.success("copied successfully");
          }}
          className="flex h-10 items-center gap-2"
        >
          <BsShare size={15} />
          Share
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

type RemoveFromPlaylistButtonProps = {
  playlistId: string;
  trackId: string;
  setShowMoreButton?: Dispatch<SetStateAction<boolean>>;
  setOpened?: Dispatch<SetStateAction<boolean>>;
  playlists: string[];
};

function RemoveFromPlaylistButton({
  playlistId,
  trackId,
  setShowMoreButton,
  playlists,
}: RemoveFromPlaylistButtonProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { data: actualPlaylists } = usePlaylists();
  const removeFromPlaylistHandler: MouseEventHandler<HTMLDivElement> = (e) => {
    e.stopPropagation();
    dispatch(removeTrackFromPlaylist({ playlistId, trackId }));
    void removeTrackFromPlaylistDB({
      playlistId,
      trackId,
      playlists,
    }).then(() => {
      revalidate(`/playlist/${playlistId}`);
      revalidate(
        `/artist/${actualPlaylists?.find((playlist) => playlist.creatorId === playlistId)?.creatorId}`,
      );
      setShowMoreButton?.(false);
    });
  };
  return (
    <DropdownMenuItem
      onClick={removeFromPlaylistHandler}
      className="flex h-10 items-center gap-2"
    >
      <BsTrash size={20} />
      Remove from this playlist
    </DropdownMenuItem>
  );
}

type AddToPlaylistProps = {
  track?: Track | null;
  trigger?: ReactNode;
};

export function AddToPlaylist({ track, trigger }: AddToPlaylistProps) {
  const [open, setOpen] = useState(false);
  const { data: user } = useSession();
  const { data: playlists } = usePlaylists();
  const dispatch = useDispatch<AppDispatch>();
  const userPlaylists = useMemo(
    () =>
      playlists?.filter((playlist) => playlist.creatorId === user?.user?.id),
    [playlists, user],
  );
  const handleSelectPlaylist = async (value: string) => {
    const data = { playlistId: value, trackId: track?.id ?? "" };
    dispatch(addTrackToPlaylist(data));
    await addTrackToPlaylistToDB(data);
    revalidate(`/playlist/${value}`);
    revalidate(
      `/artist/${playlists?.find((playlist) => playlist.creatorId === value)?.creatorId}`,
    );
  };
  return (
    <>
      <Popover open={open} onOpenChange={setOpen} modal>
        <PopoverTrigger asChild className="border-none px-0">
          {trigger ?? (
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="w-full justify-between bg-transparent px-0 pl-1 pr-2"
            >
              <div className="flex items-center gap-1">
                <BsPlus size={30} />
                Add to library
              </div>
              <RiArrowRightSLine className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          )}
        </PopoverTrigger>
        <PopoverContent className="-top-4 w-96 p-0">
          <Command>
            <CommandInput placeholder="Find a playlist" />
            <CommandEmpty>No playlist found.</CommandEmpty>
            <CommandList>
              <CommandGroup>
                {userPlaylists?.map((playlist) => (
                  <CommandItem
                    key={playlist.id}
                    value={playlist.id}
                    onSelect={(currentValue: string) => {
                      if (track?.playlists.includes(playlist.id)) return;
                      void handleSelectPlaylist(currentValue);
                      setOpen(false);
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        track?.playlists.includes(playlist.id)
                          ? "opacity-100"
                          : "opacity-0",
                      )}
                    />
                    {playlist.title}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </>
  );
}
