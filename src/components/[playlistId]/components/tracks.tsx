import { Table } from "@/components/ui/table";
import { useTracks } from "@/hooks/use-tracks";
import { type TrackFilters } from "@/types";
import { type Dispatch, type SetStateAction } from "react";
import { type Playlist } from "@prisma/client";
import { useSession } from "@/hooks/use-session";
import { NonSortTable } from "@/components/components/non-sort-table";
import { SortTable } from "@/components/components/sort-table";

type TracksProps = {
  id: string;
  filters: TrackFilters;
  setFilters: Dispatch<SetStateAction<TrackFilters>>;
  handleFilterChange: (name: keyof TrackFilters) => void;
  trackQuery: string | null;
  playlist: Playlist;
};

export function Tracks({
  filters,
  setFilters,
  handleFilterChange,
  trackQuery,
  playlist,
}: TracksProps) {
  const { data: user } = useSession();
  const { data } = useTracks();
  const isCreatedByUser = playlist.creatorId === user?.user?.id;

  return (
    <Table>
      {isCreatedByUser ? (
        <SortTable
          data={data}
          filters={filters}
          handleFilterChange={handleFilterChange}
          playlist={playlist}
          setFilters={setFilters}
          trackQuery={trackQuery}
        />
      ) : (
        <NonSortTable
          showTrackImage={false}
          viewAs={filters.viewAs}
          data={data}
          playlist={playlist}
        />
      )}
    </Table>
  );
}
