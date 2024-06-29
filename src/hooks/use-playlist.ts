import { getPlaylist } from "@/server/actions/playlist";
import { usePlaylists } from "./use-playlists";
import { useQuery } from "react-query";
import { type PlaylistsSliceType } from "@/state/slices/playlists";
import { type Playlist } from "@prisma/client";

export function usePlaylist(
  id: string,
): Omit<PlaylistsSliceType, "data"> & { data: Playlist | null } {
  const playlists = usePlaylists();
  const data = playlists.data?.find((playlist) => playlist.id === id);
  const {
    data: playlist,
    isLoading,
    isError,
  } = useQuery({
    queryKey: `playlist-${id}`,
    queryFn: async () => {
      if (data) return null;
      return await getPlaylist(id);
    },
  });
  console.log("doens't", playlist);
  return {
    data: data ?? playlist ?? null,
    error: playlists.error ?? isError ? "something went wrong" : null,
    status: playlists.status || isLoading ? "loading" : "success",
  };
}
