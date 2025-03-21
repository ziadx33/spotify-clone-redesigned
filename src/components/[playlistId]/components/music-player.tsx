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
  queueTypeId?: string;
  newAlbum?: boolean;
  showExploreButton?: boolean;
  disabled?: boolean;
};

export function MusicPlayer({
  playlist,
  showTrackImage,
  queueTypeId,
  showExploreButton = true,
  newAlbum,
  disabled,
}: MusicPlayerProps) {
  const [filters, setFilters] = useState<TrackFilters>(
    DEFAULT_TRACK_FILTERS_DATA,
  );
  const [trackQuery, setTrackQuery] = useState<string | null>(null);
  const handleFilterChange = handleTrackFilterChange(setFilters);
  return (
    <>
      <Player
        disabled={disabled}
        showExploreButton={showExploreButton}
        queueTypeId={queueTypeId}
        playlist={playlist}
        setTrackQuery={setTrackQuery}
        setFilters={setFilters}
        handleFilterChange={handleFilterChange}
        filters={filters}
      />
      {!newAlbum && (
        <Tracks
          queueTypeId={queueTypeId}
          showTrackImage={showTrackImage}
          handleFilterChange={handleFilterChange}
          playlist={playlist}
          trackQuery={trackQuery}
          setFilters={setFilters}
          filters={filters}
        />
      )}
    </>
  );
}
