import { QueuePlayButtonProps } from "@/components/queue-play-button";
import { Playlist } from "@prisma/client";
import { useTracks } from "./use-tracks";
import { useMemo } from "react";

export function useGetPlayData({ playlist }: { playlist?: Playlist | null }) {
  const { data, status } = useTracks();
  const playData = useMemo((): QueuePlayButtonProps["data"] => {
    if (status !== "success" || !data || !playlist) return;
    return {
      data: {
        trackList: data.tracks?.map((track) => track.id) ?? [],
        type: "PLAYLIST",
        typeId: playlist.id,
        currentPlaying: data.tracks?.[0]?.id ?? "",
      },
      tracks: data,
      typePlaylist: playlist,
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, data, playlist]);
  return playData;
}
