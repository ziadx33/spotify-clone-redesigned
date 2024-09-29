import { type QueuePlayButtonProps } from "@/components/queue-play-button";
import { type Track, type User, type Playlist } from "@prisma/client";
import { useTracks } from "./use-tracks";
import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  getTracksByArtistId,
  getTracksByPlaylistId,
} from "@/server/actions/track";
import { getPlaylist } from "@/server/actions/playlist";

type UseGetPlayData = {
  playlist?: Playlist | null;
  artist?: User | null;
  track?: Track | null;
};

export function useGetPlayData({ playlist, track, artist }: UseGetPlayData) {
  const { data, status } = useTracks();

  const { data: nonPlaylistData } = useQuery({
    queryKey: [`non-playlist-data-${track?.id ?? artist?.id}`],
    queryFn: async () => {
      if (artist) {
        const res = await getTracksByArtistId(artist.id);
        return {
          tracks: res.tracks,
          authors: res.data.authors,
          albums: res.data.playlists,
          artist,
          playlist: undefined,
        };
      }

      if (track) {
        const res = await getTracksByPlaylistId([track.id]);
        const playlistData = await getPlaylist(track.albumId);
        return { ...res, playlist: playlistData };
      }

      return null;
    },
    enabled: !!track || !!artist,
  });

  const usedData = (playlist ? data?.tracks : nonPlaylistData?.tracks)?.map(
    (track) => track.id,
  );

  const usedTypeData = playlist ?? artist ?? track;

  const playData = useMemo((): QueuePlayButtonProps["data"] | undefined => {
    if (status !== "success" || !usedData) return undefined;

    return {
      data: {
        trackList: usedData ?? [],
        type: "PLAYLIST",
        typeId: usedTypeData!.id,
        currentPlaying: data.tracks?.[0]?.id ?? "",
      },
      tracks: data,
      typePlaylist: track ? nonPlaylistData?.playlist : playlist ?? undefined,
      typeArtist: artist ? (usedTypeData as User) : undefined,
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, data, playlist, usedData, usedTypeData, artist]);

  return playData;
}
