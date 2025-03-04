import { usePlaylists } from "./use-playlists";
import { useQuery } from "@tanstack/react-query";
import { type PlaylistsSliceType } from "@/state/slices/playlists";
import { type Playlist } from "@prisma/client";
import { useEffect } from "react";
import { getPlaylist } from "@/server/queries/playlist";

type UsePlaylistReturnType = Omit<PlaylistsSliceType, "data"> & {
  data: Playlist | null;
};

export function usePlaylist(id: string): UsePlaylistReturnType {
  const { data: playlists } = usePlaylists();
  const data = playlists.data?.find((playlist) => playlist.id === id);
  const {
    data: playlist,
    isError,
    refetch,
  } = useQuery({
    queryKey: [`playlist-${id}`, data],
    queryFn: async () => {
      if (data) return null;
      const res = await getPlaylist({ id });
      return res;
    },
  });
  useEffect(() => {
    if (!data) void refetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);
  return {
    data: data ?? playlist ?? null,
    error: playlists.error ?? isError ? "something went wrong" : null,
    status:
      playlists.status === "loading" || (!data && !playlist)
        ? "loading"
        : "success",
  };
}
