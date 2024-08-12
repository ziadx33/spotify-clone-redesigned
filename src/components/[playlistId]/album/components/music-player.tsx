import { type Playlist } from "@prisma/client";
import { type TrackFilters } from "@/types";
import { useState } from "react";
import { DEFAULT_TRACK_FILTERS_DATA } from "@/constants";
import { Player } from "../../components/player";
import { Tracks } from "../../components/tracks";
import { handleTrackFilterChange } from "@/utils/track";

type MusicPlayerProps = {
  id: Playlist["id"];
  playlist?: Playlist | null;
};

export function MusicPlayer({ id, playlist }: MusicPlayerProps) {
  const [filters, setFilters] = useState<TrackFilters>(
    DEFAULT_TRACK_FILTERS_DATA,
  );
  const [trackQuery, setTrackQuery] = useState<string | null>(null);
  const [selectedTracks, setSelectedTracks] = useState<string[]>([]);
  const handleFilterChange = handleTrackFilterChange(setFilters);
  return (
    <>
      <Player
        setSelectedTracks={setSelectedTracks}
        selectedTracks={selectedTracks}
        handleFilterChange={handleFilterChange}
        playlist={playlist}
        setTrackQuery={setTrackQuery}
        setFilters={setFilters}
        id={id}
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
        id={id}
      />
    </>
  );
}
