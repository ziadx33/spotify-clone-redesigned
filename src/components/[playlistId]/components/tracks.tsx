import { Table } from "@/components/ui/table";
import { useTracks } from "@/hooks/use-tracks";
import { type TrackFilters } from "@/types";
import { type Dispatch, type SetStateAction } from "react";
import { type Playlist } from "@prisma/client";
import { NonSortTable } from "@/components/components/non-sort-table";
import { SortTable } from "@/components/components/sort-table";
import { TracksListSkeleton } from "@/components/artist/components/skeleton";
import { useUserData } from "@/hooks/use-user-data";

type TracksProps = {
  filters: TrackFilters;
  setFilters: Dispatch<SetStateAction<TrackFilters>>;
  handleFilterChange: (name: keyof TrackFilters) => void;
  trackQuery: string | null;
  playlist?: Playlist | null;
  selectedTracks?: string[];
  setSelectedTracks?: Dispatch<SetStateAction<string[]>>;
  showTrackImage?: boolean;
  queueTypeId?: string;
};

export function Tracks({
  filters,
  setFilters,
  handleFilterChange,
  trackQuery,
  playlist,
  setSelectedTracks,
  selectedTracks,
  showTrackImage = false,
  queueTypeId,
}: TracksProps) {
  const user = useUserData();
  const {
    data: { data, status },
  } = useTracks();
  const isCreatedByUser = playlist?.creatorId === user?.id;

  return !!playlist || status !== "loading" ? (
    <Table>
      {isCreatedByUser && playlist ? (
        <SortTable
          setSelectedTracks={setSelectedTracks}
          selectedTracks={selectedTracks}
          data={data}
          filters={filters}
          handleFilterChange={handleFilterChange}
          playlist={playlist}
          setFilters={setFilters}
          showCaption
          trackQuery={trackQuery}
        />
      ) : (
        <NonSortTable
          queueTypeId={queueTypeId}
          setSelectedTracks={setSelectedTracks}
          selectedTracks={selectedTracks}
          showTrackImage={showTrackImage}
          viewAs={filters.viewAs}
          data={data}
          showCaption
          playlist={playlist ?? undefined}
        />
      )}
    </Table>
  ) : (
    <TracksListSkeleton amount={5} />
  );
}
