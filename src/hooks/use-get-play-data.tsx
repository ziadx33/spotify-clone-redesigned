import { type Track, type User, type Playlist } from "@prisma/client";
import { useTracks } from "./use-tracks";
import { useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  getTracksByArtistId,
  getTracksByPlaylistId,
} from "@/server/actions/track";
import { getPlaylist } from "@/server/actions/playlist";
import { type QueuePlayButtonProps } from "@/components/queue-play-button";

type UseGetPlayData = {
  playlist?: Playlist | null;
  artist?: User | null;
  track?: Track | null;
  skipToTrack?: string;
};

export function useGetPlayData({
  playlist,
  track,
  artist,
  skipToTrack,
}: UseGetPlayData): {
  getData: () => Promise<Omit<NonNullable<QueuePlayButtonProps>, "children">>;
} {
  const { data } = useTracks();
  const shouldFetch = useRef(false);

  const { refetch, data: nonPlaylistData } = useQuery({
    queryKey: [
      `non-playlist-queue-data-${track?.id ?? artist?.id ?? playlist?.id}`,
    ],
    queryFn: async () => {
      if (!shouldFetch.current) return null;
      console.log(artist, track, playlist, "ya 3rs");
      if (artist) {
        const res = await getTracksByArtistId(artist.id);
        return {
          data: {
            tracks: res.tracks ?? [],
            authors: res.data.authors ?? [],
            albums: res.data.playlists ?? [],
          },
          artist,
          playlist: undefined,
        };
      }

      if (track) {
        const res = await getTracksByPlaylistId(track.albumId);
        console.log("w bashot", res);
        const playlistData = await getPlaylist(track.albumId);
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

      if (playlist && !data) {
        const res = await getTracksByPlaylistId(playlist.id);
        console.log("ro7 ya 3rs men hena", res);
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
    enabled: !!track || !!artist,
  });

  const getData: () => Promise<
    Omit<QueuePlayButtonProps, "children">
  > = async () => {
    shouldFetch.current = true;
    const nonData = nonPlaylistData ?? (await refetch()).data;
    console.log("betkoon mafshoo5 fash5", nonData);
    const usedData = (nonData ? nonData.data.tracks : data?.tracks)?.map(
      (track) => track.id,
    );

    const usedTypeData = artist ?? track ?? playlist;

    return {
      data: {
        data: {
          trackList: usedData ?? [],
          type: artist ? "ARTIST" : "PLAYLIST",
          typeId: usedTypeData!.id,
          currentPlaying: skipToTrack ?? "",
        },
        tracks: (track ?? artist ?? (playlist && !data)
          ? nonData?.data
          : data)!,
        typePlaylist: track ? nonData?.playlist : playlist ?? undefined,
        typeArtist: artist ? artist : undefined,
      },
    };
  };

  return { getData };
}
