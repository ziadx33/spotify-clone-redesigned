import { type Playlist } from "@prisma/client";
import { Player } from "./player";
import { Tracks } from "./tracks";
import { type TrackFilters } from "@/types";
import { useState } from "react";
import { DEFAULT_TRACK_FILTERS_DATA } from "@/constants";
import { handleTrackFilterChange } from "@/utils/track";

type MusicPlayerProps = {
  playlist?: Playlist | null;
  showTrackImage?: boolean;
};

export function MusicPlayer({ playlist, showTrackImage }: MusicPlayerProps) {
  const [filters, setFilters] = useState<TrackFilters>(
    DEFAULT_TRACK_FILTERS_DATA,
  );
  const [trackQuery, setTrackQuery] = useState<string | null>(null);
  const handleFilterChange = handleTrackFilterChange(setFilters);
  return (
    <>
      <Player
        playlist={playlist}
        setTrackQuery={setTrackQuery}
        setFilters={setFilters}
        handleFilterChange={handleFilterChange}
        filters={filters}
      />
      <Tracks
        showTrackImage={showTrackImage}
        handleFilterChange={handleFilterChange}
        playlist={playlist}
        trackQuery={trackQuery}
        setFilters={setFilters}
        filters={filters}
      />
    </>
  );
}
