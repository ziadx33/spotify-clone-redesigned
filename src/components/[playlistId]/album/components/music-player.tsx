import { type Playlist } from "@prisma/client";
import { type TrackFilters } from "@/types";
import { useMemo, useState } from "react";
import { DEFAULT_TRACK_FILTERS_DATA } from "@/constants";
import { Player } from "../../components/player";
import { Tracks } from "../../components/tracks";
import { handleTrackFilterChange } from "@/utils/track";
import { useTracks } from "@/hooks/use-tracks";
import { type QueuePlayButtonProps } from "@/components/queue-play-button";

type MusicPlayerProps = {
  playlist?: Playlist | null;
};

export function MusicPlayer({ playlist }: MusicPlayerProps) {
  const [filters, setFilters] = useState<TrackFilters>(
    DEFAULT_TRACK_FILTERS_DATA,
  );
  const [trackQuery, setTrackQuery] = useState<string | null>(null);
  const [selectedTracks, setSelectedTracks] = useState<string[]>([]);
  const handleFilterChange = handleTrackFilterChange(setFilters);
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
  console.log("yabn el", playlist);
  return (
    <>
      <Player
        playData={playData}
        setSelectedTracks={setSelectedTracks}
        selectedTracks={selectedTracks}
        handleFilterChange={handleFilterChange}
        playlist={playlist}
        setTrackQuery={setTrackQuery}
        setFilters={setFilters}
        filters={filters}
      />
      <Tracks
        handleFilterChange={handleFilterChange}
        selectedTracks={selectedTracks}
        setSelectedTracks={setSelectedTracks}
        playlist={playlist}
        trackQuery={trackQuery}
        setFilters={setFilters}
        filters={filters}
      />
    </>
  );
}
