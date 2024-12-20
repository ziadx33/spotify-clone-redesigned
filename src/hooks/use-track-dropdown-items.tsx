import { type DropdownMenuType } from "@/types";
import { type Playlist, type Track } from "@prisma/client";
import { BsShare, BsTrash } from "react-icons/bs";
import { FaPlus } from "react-icons/fa";
import { usePlayQueue } from "./use-play-queue";
import { useDispatch } from "react-redux";
import { type AppDispatch } from "@/state/store";
import { usePlaylists } from "./use-playlists";
import {
  addTrackToPlaylist,
  removeTrackFromPlaylist,
} from "@/state/slices/tracks";
import {
  addTrackToPlaylistToDB,
  removeTrackFromPlaylistDB,
} from "@/server/actions/track";
import { revalidate } from "@/server/actions/revalidate";
import { RiPlayListLine } from "react-icons/ri";
import {
  MdAddToQueue,
  MdMusicNote,
  MdOutlineLibraryMusic,
} from "react-icons/md";
import { toast } from "sonner";
import { type SliceType } from "@/state/types";
import { useRouter } from "next/navigation";
import { useUserData } from "./use-user-data";

type ReturnType = SliceType<{
  events: {
    addToPlaylistHandler: (playlist: Playlist, currentTrack: Track) => void;
    removeFromPlaylistHandler: (
      playlist: Playlist,
      currentTrack: Track,
    ) => void;
  };
  data: DropdownMenuType[];
}>;

// Function overload signatures
export function useTrackDropdownItems({
  track,
  playlist,
  isFn,
}: {
  playlist?: Playlist | null;
  track?: Track | null;
  isFn?: true;
}): (track: Track) => ReturnType;

export function useTrackDropdownItems({
  track,
  playlist,
  isFn,
}: {
  playlist?: Playlist | null;
  track?: Track | null;
  isFn?: false;
}): ReturnType;

// Actual implementation
export function useTrackDropdownItems({
  track,
  playlist,
  isFn,
}: {
  playlist?: Playlist | null;
  track?: Track | null;
  isFn?: boolean;
}): unknown {
  const { data } = usePlaylists();
  const dispatch = useDispatch<AppDispatch>();
  const user = useUserData();
  const { playHandler: addQueue } = usePlayQueue({
    skipToTrack: track?.id,
    track,
  });
  const router = useRouter();

  if (!user && !isFn) {
    return { status: "loading", data: null, error: null };
  }

  const isInUserPlaylist = playlist?.creatorId === user?.id;

  if (data.status !== "success") return data;
  if (!track && !isFn) {
    return { error: "track doesn't exist", data: null, status: "error" };
  }

  const addToPlaylistHandler = async (
    playlist: Playlist,
    currentTrack: Track,
  ) => {
    const dispatchData = {
      playlistId: playlist.id,
      trackId: currentTrack.id,
    };
    dispatch(addTrackToPlaylist(dispatchData));
    await addTrackToPlaylistToDB(dispatchData);
    void revalidate(`/playlist/${dispatchData.playlistId}`);
    void revalidate(
      `/artist/${
        data.data?.find(
          (playlist) => playlist.creatorId === dispatchData.playlistId,
        )?.creatorId
      }`,
    );
    toast.success(`added to ${playlist.title} successfully!`);
  };

  const removeFromPlaylistHandler = (
    playlist: Playlist,
    currentTrack: Track,
  ) => {
    const { id: playlistId } = playlist;
    const { id: trackId } = currentTrack;

    dispatch(removeTrackFromPlaylist({ playlistId, trackId }));
    void removeTrackFromPlaylistDB({
      playlistId,
      trackId,
      playlists: currentTrack.playlists,
    }).then(() => {
      void revalidate(`/playlist/${playlistId}`);
      void revalidate(
        `/artist/${
          data.data?.find((playlist) => playlist.creatorId === playlistId)
            ?.creatorId
        }`,
      );
    });
    toast.success(`removed from ${playlist.title} successfully!`);
  };

  const generateDropdownData = (currentTrack: Track): DropdownMenuType[] => {
    let dropdownData: DropdownMenuType[] = [
      {
        icon: FaPlus,
        title: "Add to playlist",
        nestedMenu: {
          isSearchable: true,
          items: data.data
            .filter((playlist) => playlist.creatorId === user?.id)
            ?.map((playlist) => ({
              title: playlist.title,
              icon: RiPlayListLine,
              event: () => addToPlaylistHandler(playlist, currentTrack),
            })),
        },
      },
      {
        title: "Add to queue",
        icon: MdAddToQueue,
        event: () => {
          void addQueue();
        },
      },
      {
        title: "Go to Artist",
        icon: MdMusicNote,
        event: () => {
          void router.push(
            `/artist/${currentTrack.authorId}?playlist=${playlist?.id}`,
          );
        },
      },
      {
        title: "Go to Album",
        icon: MdOutlineLibraryMusic,
        event: () => {
          void router.push(`/playlist/${currentTrack.albumId}`);
        },
      },
      {
        title: "Share",
        icon: BsShare,
        event: () => {
          void navigator.clipboard
            .writeText(`${location.origin}/playlist/${currentTrack.albumId}`)
            .then(() => {
              toast.success("copied successfully");
            });
        },
      },
    ];

    if (playlist && isInUserPlaylist) {
      dropdownData = [
        dropdownData[0]!,
        {
          title: "Remove from this playlist",
          icon: BsTrash,
          event: () => removeFromPlaylistHandler(playlist, currentTrack),
        },
        ...dropdownData.slice(1),
      ];
    }

    return dropdownData;
  };

  const events = {
    addToPlaylistHandler,
    removeFromPlaylistHandler,
  };

  if (isFn) {
    return (passedTrack: Track) => ({
      data: {
        events,
        data: generateDropdownData(passedTrack),
      } as const,
      error: null,
      status: "success",
    });
  }

  return {
    data: {
      events,
      data: generateDropdownData(track!),
    } as const,
    error: null,
    status: "success",
  };
}
