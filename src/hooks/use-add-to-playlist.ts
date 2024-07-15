import { removePlaylist, addPlaylist } from "@/state/slices/playlists";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useUpdateUser } from "./use-update-user";
import { useSession } from "./use-session";
import { type Playlist } from "@prisma/client";

type UseAddPlaylistProps = {
  playlist: Playlist | null;
};

export function useAddToPlaylist({ playlist }: UseAddPlaylistProps) {
  const { data: user } = useSession();
  const isAddedToLibrary = user?.user?.playlists?.includes(playlist?.id ?? "");
  const { update: updateUser } = useUpdateUser();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

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
    router.prefetch("/");
    router.prefetch(`/artist/${playlist?.creatorId}`);
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
    router.prefetch("/");
    router.prefetch(`/artist/${playlist?.creatorId}`);
  };
  return {
    isLoading,
    handleAddPlaylist,
    handleRemovePlaylist,
    toggle,
    isAddedToLibrary,
  };
}
