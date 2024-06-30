import { getPlaylist } from "@/server/actions/playlist";
import { usePlaylists } from "./use-playlists";
import { useQuery } from "react-query";
import { type PlaylistsSliceType } from "@/state/slices/playlists";
import { type Playlist } from "@prisma/client";
import { useEffect } from "react";

type UsePlaylistReturnType = Omit<PlaylistsSliceType, "data"> & {
  data: Playlist | null;
};

export function usePlaylist(id: string): UsePlaylistReturnType {
  const playlists = usePlaylists();
  const data = playlists.data?.find((playlist) => playlist.id === id);
  const {
    data: playlist,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryFn: async () => {
      if (data) return null;
      return await getPlaylist(id);
    },
  });
  useEffect(() => {
    if (!data) void refetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);
  return {
    data: data ?? playlist ?? null,
    error: playlists.error ?? isError ? "something went wrong" : null,
    status: playlists.status || isLoading ? "loading" : "success",
  };
}
