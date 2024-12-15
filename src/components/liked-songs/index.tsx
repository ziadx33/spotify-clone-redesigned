"use client";

import { useUserData } from "@/hooks/use-user-data";
import { editTrackById, getUserLikedSongs } from "@/server/actions/track";
import { useQuery } from "@tanstack/react-query";
import { SortTable } from "../components/sort-table";
import { DEFAULT_TRACK_FILTERS_DATA } from "@/constants";
import { useState } from "react";
import { type TrackFilters } from "@/types";
import { handleTrackFilterChange } from "@/utils/track";
import { SearchTrack } from "../[playlistId]/components/recommended-search";
import { revalidate } from "@/server/actions/revalidate";
import { Table } from "../ui/table";

export function LikedSongs() {
  const user = useUserData();

  const { data, isLoading, refetch } = useQuery({
    queryKey: [`user-liked-tracks-${user.id}`],
    queryFn: async () => {
      console.log("bes");
      const tracks = await getUserLikedSongs(user.id);

      return tracks;
    },
  });

  const [filters, setFilters] = useState<TrackFilters>(
    DEFAULT_TRACK_FILTERS_DATA,
  );
  const handleFilterChange = handleTrackFilterChange(setFilters);

  return (
    <div className="py-4">
      {(data?.tracks.length ?? 0) > 0 || isLoading ? (
        <Table>
          <SortTable
            data={{
              albums: data?.albums,
              authors: data?.authors,
              tracks: data?.tracks,
            }}
            isLoading={isLoading}
            filters={filters}
            setFilters={setFilters}
            handleFilterChange={handleFilterChange}
            trackQuery={null}
          />
        </Table>
      ) : (
        <div className="px-4">
          <SearchTrack
            addTrackToPlaylistFn={async (track) => {
              await editTrackById({
                id: track?.id,
                data: { likedUsers: [...(track?.likedUsers ?? []), user.id] },
              });
              revalidate("/liked-songs");
              await refetch();
            }}
            tableProps={{
              viewAs: "LIST",
              hidePlayButton: false,
            }}
          />
        </div>
      )}
    </div>
  );
}
