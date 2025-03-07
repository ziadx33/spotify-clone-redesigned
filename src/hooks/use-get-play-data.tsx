import { type Track, type User, type Playlist } from "@prisma/client";
import { useTracks } from "./use-tracks";
import { useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { type QueuePlayButtonProps } from "@/components/queue-play-button";
import { getPlaylist, getPlaylistTracks } from "@/server/queries/playlist";
import { getArtistTracks } from "@/server/queries/user";

type UseGetPlayData = {
  playlist?: Playlist | null;
  artist?: User | null;
  track?: Track | null;
  skipToTrack?: string;
  noDefPlaylist?: boolean;
  queueTypeId?: string;
};

export function useGetPlayData({
  playlist,
  track,
  artist,
  skipToTrack,
  noDefPlaylist,
  queueTypeId,
}: UseGetPlayData): {
  getData: () => Promise<
    Omit<NonNullable<QueuePlayButtonProps>, "children"> | undefined
  >;
} {
  const {
    data: { data },
  } = useTracks();
  const shouldFetch = useRef(false);

  const { refetch, data: nonPlaylistData } = useQuery({
    queryKey: [
      `non-playlist-queue-data-${track?.id ?? artist?.id ?? playlist?.id}`,
    ],
    queryFn: async () => {
      if (!shouldFetch.current) return null;
      if (artist) {
        const res = await getArtistTracks(artist.id);
        return {
          data: {
            tracks: res?.tracks ?? [],
            authors: res?.data.authors ?? [],
            albums: res?.data.playlists ?? [],
          },
          artist,
          playlist: undefined,
        };
      }

      if (track) {
        const res = await getPlaylistTracks({ playlistId: track.albumId });
        const playlistData = await getPlaylist({ id: track.albumId });
        return {
          data: {
            tracks: res.data?.tracks ?? [],
            authors: res.data?.authors ?? [],
            albums: res.data?.albums ?? [],
          },
          playlist: playlistData,
          artist: undefined,
        };
      }

      if (playlist && noDefPlaylist && !queueTypeId) {
        const res = await getPlaylistTracks({ playlistId: playlist.id });
        return {
          data: {
            tracks: res.data?.tracks ?? [],
            authors: res.data?.authors ?? [],
            albums: res.data?.albums ?? [],
          },
          playlist: playlist,
          artist: undefined,
        };
      }

      return null;
    },
    enabled: !!track || !!artist || (!!playlist && noDefPlaylist),
  });

  const getData: () => Promise<
    Omit<QueuePlayButtonProps, "children"> | undefined
  > = async () => {
    shouldFetch.current = true;

    const nonData = nonPlaylistData ?? (await refetch()).data;
    const usedData = (nonData ? nonData.data.tracks : data?.tracks)?.map(
      (track) => track.id,
    );

    const usedTypeData = artist ?? track ?? playlist;

    const curPlaying = skipToTrack ?? usedData?.[0];

    if (!curPlaying) return undefined;

    return {
      data: {
        data: {
          trackList: usedData ?? [],
          type: artist ? "ARTIST" : "PLAYLIST",
          typeId: queueTypeId ?? usedTypeData?.id ?? null,
          currentPlaying: curPlaying,
        },
        tracks: (!queueTypeId
          ? track ?? artist ?? (playlist && noDefPlaylist)
            ? nonData?.data
            : data
          : data)!,
        typePlaylist: !queueTypeId
          ? track
            ? nonData?.playlist
            : !queueTypeId
              ? playlist
              : undefined
          : undefined,
        typeArtist: artist ? artist : undefined,
      },
    };
  };

  return { getData };
}
