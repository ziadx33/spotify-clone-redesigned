import { removePlaylist, addPlaylist } from "@/state/slices/playlists";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useUpdateUser } from "./use-update-user";
import { useSession } from "./use-session";
import { type Playlist } from "@prisma/client";
import { revalidate } from "@/server/actions/revalidate";

type UseAddPlaylistProps = {
  playlist?: Playlist | null;
};

export function useAddToPlaylist({ playlist }: UseAddPlaylistProps) {
  const { data: user } = useSession();
  const isAddedToLibrary = user?.user?.playlists?.includes(playlist?.id ?? "");
  const { update: updateUser } = useUpdateUser();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);

  const handleRemovePlaylist = async () => {
    setIsLoading(true);
    const data = {
      playlists:
        user?.user?.playlists?.filter((playlist) => playlist !== playlist) ??
        [],
    };
    await updateUser({
      data,
    });
    revalidate("/");
    revalidate(`/artist/${playlist?.creatorId}`);
    dispatch(removePlaylist(playlist?.id ?? ""));
    setIsLoading(false);
  };

  const handleAddPlaylist = async () => {
    setIsLoading(true);
    const data = {
      playlists: [...(user?.user?.playlists ?? []), playlist?.id ?? ""],
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
    revalidate("/");
    revalidate(`/artist/${playlist?.creatorId}`);
  };
  return {
    isLoading,
    handleAddPlaylist,
    handleRemovePlaylist,
    toggle,
    isAddedToLibrary,
  };
}
