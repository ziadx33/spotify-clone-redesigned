/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { type DropdownMenuType } from "@/types";
import { $Enums, type Playlist } from "@prisma/client";
import { useAddToPlaylist } from "./use-add-to-playlist";
import { FaCircleCheck, FaRegFolderClosed } from "react-icons/fa6";
import { FaPlusCircle } from "react-icons/fa";
import { useQueue } from "./use-queue";
import { PiQueueBold } from "react-icons/pi";
import { IoPencil } from "react-icons/io5";
import { Dialog } from "@/components/ui/dialog";
import { EditPlaylistDialogContent } from "@/components/[playlistId]/components/edit-playlist-dialog-content";
import { useState } from "react";
import { type SliceType } from "@/state/types";
import { CiCircleMinus, CiLock } from "react-icons/ci";
import {
  addTracksToPlaylist,
  deletePlaylist,
  updatePlaylist,
} from "@/server/actions/playlist";
import { editPlaylist, removePlaylist } from "@/state/slices/playlists";
import { useDispatch } from "react-redux";
import { type AppDispatch } from "@/state/store";
import { usePlaylists } from "./use-playlists";
import { FiPlus } from "react-icons/fi";
import { useRouter } from "next/navigation";
import { TbWorld } from "react-icons/tb";
import { MdIosShare, MdOutlineBackupTable } from "react-icons/md";
import { RiPlayListLine } from "react-icons/ri";
import { getTracksByPlaylistId } from "@/server/actions/track";
import { type TracksSliceType, addTracks } from "@/state/slices/tracks";
import { useTracks } from "./use-tracks";
import { useNavigate } from "./use-navigate";
import { editPrefrence } from "@/state/slices/prefrence";
import { usePrefrences } from "./use-prefrences";
import { editUserPrefrence } from "@/server/actions/prefrence";
import { useUserData } from "./use-user-data";
import { useFolders } from "./use-folders";
import {
  addPlaylistToFolder,
  removePlaylistFromFolder,
} from "@/server/actions/folder";
import { editFolder } from "@/state/slices/folders";
import { IoMdDownload } from "react-icons/io";
import { downloadAudios } from "@/utils/download-audios";

type usePlaylistDropdownItemsProps = {
  playlist?: Playlist | null;
};

export function usePlaylistDropdownItems({
  playlist,
}: usePlaylistDropdownItemsProps): SliceType<DropdownMenuType[]> {
  const user = useUserData();
  const { data: folders } = useFolders();
  const nonAddedFolders = playlist
    ? folders?.filter((folder) => !folder.playlistIds.includes(playlist?.id))
    : [];
  const addedFolders = playlist
    ? folders?.filter((folder) => folder.playlistIds.includes(playlist?.id))
    : [];
  const { toggle, isAddedToLibrary } = useAddToPlaylist({ playlist });
  const {
    addDataToQueue,
    data: { data: queueData },
  } = useQueue();
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const {
    data: { data: playlists, status: playlistStatus },
  } = usePlaylists();
  const router = useRouter();
  const {
    data: { data: tracks },
  } = useTracks();
  const navigate = useNavigate({
    data: {
      href: `/playlist/${playlist?.id}`,
      title: playlist?.title ?? "unknown",
      type: "PLAYLIST",
    },
    href: `/playlist/${playlist?.id}`,
  });
  const { data: prefrences } = usePrefrences();

  if (!user || !playlist || playlistStatus !== "success")
    return {
      data: null,
      status: "loading",
      error: null,
    };

  const deleteHandler = async () => {
    await deletePlaylist(playlist.id);
    dispatch(removePlaylist(playlist.id));
    const prefrenceData = {
      homeLibSection: prefrences?.homeLibSection.filter(
        (id) => id !== playlist.id,
      ),
      homeSectionsSort: prefrences?.homeSectionsSort.filter(
        (item) => item !== playlist.title,
      ),
    };
    await editUserPrefrence({
      data: prefrenceData,
      userId: user.id,
    });
    dispatch(editPrefrence(prefrenceData));
    if (location.pathname === `/playlist/${playlist.id}`) router.push("/");
  };

  const editHandler = async () => {
    const data = {
      id: playlist.id,
      data: {
        visibility:
          playlist.visibility === "PRIVATE"
            ? $Enums.PLAYLIST_VISIBILITY.PUBLIC
            : $Enums.PLAYLIST_VISIBILITY.PRIVATE,
      },
    };
    await updatePlaylist(data);
    dispatch(editPlaylist(data));
  };

  const addToPlaylistHandler = async (id: string) => {
    let data: TracksSliceType["data"];
    if (location.pathname !== `/playlist/${playlist.id}`) {
      data = (await getTracksByPlaylistId(playlist.id)).data;
    } else {
      data = tracks;
    }
    await addTracksToPlaylist({
      tracks: data?.tracks ?? [],
      playlistId: id,
    });
    if (location.pathname === `/playlist/${id}`) dispatch(addTracks(data));
  };

  const addToFolderHandler = async (id: string) => {
    const folder = nonAddedFolders?.find((folder) => folder.id === id);
    dispatch(
      editFolder({
        id,
        data: { playlistIds: [...(folder?.playlistIds ?? []), playlist.id] },
      }),
    );
    await addPlaylistToFolder(playlist.id, id, user.id);
  };

  const removeToFolderHandler = async (id: string) => {
    const folder = addedFolders?.find((folder) => folder.id === id);
    dispatch(
      editFolder({
        id,
        data: {
          playlistIds: folder?.playlistIds.filter((id) => id !== playlist.id),
        },
      }),
    );
    await removePlaylistFromFolder(
      playlist.id,
      id,
      folder?.playlistIds ?? [],
      user.id,
    );
  };

  const isUserPlaylist = user?.id === playlist.creatorId;

  const playlistDialog = isUserPlaylist ? (
    <Dialog open={detailsDialogOpen} onOpenChange={setDetailsDialogOpen}>
      <EditPlaylistDialogContent
        data={playlist}
        setOpen={setDetailsDialogOpen}
      />
    </Dialog>
  ) : null;

  const data: DropdownMenuType[] = [
    {
      title: `open in new tab`,
      icon: MdOutlineBackupTable,
      event: () => navigate.apply({}, [, , false]),
    },

    ...(!isUserPlaylist
      ? [
          {
            icon: !isAddedToLibrary ? FaPlusCircle : FaCircleCheck,
            title: `${!isAddedToLibrary ? "Add to" : "Remove from"} your playlist`,
            event: () => toggle(),
          },
        ]
      : []),
    {
      icon: PiQueueBold,
      title: "Add to queue",
      event: () =>
        void addDataToQueue({
          data: playlist,
          type: "PLAYLIST",
          queueList: queueData?.queueList,
        }),
    },
    ...(isUserPlaylist
      ? [
          {
            icon: IoPencil,
            title: "Edit details",
            event: () =>
              playlist.type === "PLAYLIST"
                ? setDetailsDialogOpen(true)
                : router.push(`/albums/new?playlist=${playlist.id}`),
            content: playlist.type === "PLAYLIST" ? playlistDialog : null,
          },
        ]
      : []),
    ...(isUserPlaylist
      ? [
          {
            icon: CiCircleMinus,
            title: "Delete",
            event: () => deleteHandler(),
          },
        ]
      : []),
    ...(isUserPlaylist
      ? [
          {
            icon: playlist.visibility !== "PRIVATE" ? CiLock : TbWorld,
            title: `Make ${playlist.visibility === "PRIVATE" ? "public" : "private"}`,
            event: () => editHandler(),
          },
        ]
      : []),
    {
      title: `Add to ${isUserPlaylist ? "other " : ""}playlist`,
      icon: FiPlus,
      nestedMenu: {
        items: playlists
          .filter(
            (playlst) =>
              playlst.creatorId === user?.id && playlst.id !== playlist.id,
          )
          .map((playlist) => ({
            title: playlist.title,
            icon: RiPlayListLine,
            event: () => void addToPlaylistHandler(playlist.id),
          })),
      },
    },
    ...(isUserPlaylist && (nonAddedFolders?.length ?? 0) > 0
      ? [
          {
            title: `Add to a folder`,
            icon: FiPlus,
            nestedMenu: {
              items:
                nonAddedFolders?.map((folder) => ({
                  title: folder.name,
                  icon: FaRegFolderClosed,
                  event: () => void addToFolderHandler(folder.id),
                })) ?? [],
            },
          },
        ]
      : []),
    ...(isUserPlaylist && (addedFolders?.length ?? 0) > 0
      ? [
          {
            title: `Remove from a folder`,
            icon: FiPlus,
            nestedMenu: {
              items:
                addedFolders?.map((folder) => ({
                  title: folder.name,
                  icon: FaRegFolderClosed,
                  event: () => void removeToFolderHandler(folder.id),
                })) ?? [],
            },
          },
        ]
      : []),
    {
      title: "Download playlist tracks",
      icon: IoMdDownload,
      event: () => {
        void downloadAudios(tracks?.tracks ?? []);
      },
    },
    {
      title: "Share",
      icon: MdIosShare,
      event: () =>
        void navigator.clipboard.writeText(
          `${location.origin}/playlist/${playlist.id}`,
        ),
    },
  ];

  return {
    data,
    status: "success",
    error: null,
  };
}
