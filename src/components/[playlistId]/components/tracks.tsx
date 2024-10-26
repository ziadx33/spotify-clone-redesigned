import { Table } from "@/components/ui/table";
import { useTracks } from "@/hooks/use-tracks";
import { type TrackFilters } from "@/types";
import { type Dispatch, type SetStateAction } from "react";
import { type Playlist } from "@prisma/client";
import { useSession } from "@/hooks/use-session";
import { NonSortTable } from "@/components/components/non-sort-table";
import { SortTable } from "@/components/components/sort-table";
import { TracksListSkeleton } from "@/components/artist/components/skeleton";

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
  const { data: user } = useSession();
  const { data, status } = useTracks();
  const isCreatedByUser = playlist?.creatorId === user?.user?.id;

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
