import { removePlaylist, addPlaylist } from "@/state/slices/playlists";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useUpdateUser } from "./use-update-user";
import { type Playlist } from "@prisma/client";
import { type AppDispatch } from "@/state/store";
import { useUserData } from "./use-user-data";

type UseAddPlaylistProps = {
  playlist?: Playlist | null;
};

export function useAddToPlaylist({ playlist }: UseAddPlaylistProps) {
  const user = useUserData();
  const isAddedToLibrary = user?.playlists?.includes(playlist?.id ?? "");
  const { update: updateUser } = useUpdateUser();
  const dispatch = useDispatch<AppDispatch>();
  const [isLoading, setIsLoading] = useState(false);

  const handleRemovePlaylist = async () => {
    setIsLoading(true);
    const data = {
      playlists:
        user?.playlists?.filter((playlist) => playlist !== playlist) ?? [],
    };
    await updateUser({
      data,
    });
    dispatch(removePlaylist(playlist?.id ?? ""));
    setIsLoading(false);
  };

  const handleAddPlaylist = async () => {
    setIsLoading(true);
    const data = {
      playlists: [...(user?.playlists ?? []), playlist?.id ?? ""],
    };

    await updateUser({
      data,
    });
    dispatch(addPlaylist(playlist!));
    setIsLoading(false);
  };
  const toggle = async () => {
    if (isAddedToLibrary) await handleRemovePlaylist();
    else await handleAddPlaylist();
  };
  return {
    isLoading,
    handleAddPlaylist,
    handleRemovePlaylist,
    toggle,
    isAddedToLibrary,
  };
}
