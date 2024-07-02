import { type Playlist } from "@prisma/client";
import { Player } from "./player";
import { Tracks } from "./tracks";
import { type TrackFilters } from "@/types";
import { useState } from "react";
import { DEFAULT_TRACK_FILTERS_DATA } from "@/constants";

type MusicPlayerProps = {
  id: Playlist["id"];
  playlist: Playlist | null;
};

export function MusicPlayer({ id, playlist }: MusicPlayerProps) {
  const [filters, setFilters] = useState<TrackFilters>(
    DEFAULT_TRACK_FILTERS_DATA,
  );
  const [trackQuery, setTrackQuery] = useState<string | null>(null);
  function handleFilterChange(name: keyof TrackFilters) {
    setFilters((data) => ({
      ...DEFAULT_TRACK_FILTERS_DATA,
      viewAs: data.viewAs,
      [name]:
        data[name] === "DSC" ? null : data[name] === "ASC" ? "DSC" : "ASC",
      sortBy: data[name] === "DSC" ? "custom order" : name,
    }));
  }
  return (
    <>
      <Player
        playlist={playlist}
        setTrackQuery={setTrackQuery}
        handleFilterChange={handleFilterChange}
        setFilters={setFilters}
        id={id}
        filters={filters}
      />
      <Tracks
        playlist={playlist!}
        trackQuery={trackQuery}
        handleFilterChange={handleFilterChange}
        setFilters={setFilters}
        filters={filters}
        id={id}
      />
    </>
  );
}
