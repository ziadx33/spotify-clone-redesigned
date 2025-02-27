import {
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCaption,
} from "@/components/ui/table";
import { BsClock } from "react-icons/bs";
import { type TrackFilters } from "@/types";
import { useMemo, type Dispatch, type SetStateAction } from "react";
import { type TracksSliceType } from "@/state/slices/tracks";
import { sortTracks } from "@/utils/[playlistId]/sort-tracks";
import { Track } from "./track";
import { type Playlist } from "@prisma/client";
import { FilterButton } from "./filter-button";
import { DoubleFilter } from "./double-filter";
import { useIsMobile } from "@/hooks/use-mobile";

type SortTableProps = {
  handleFilterChange: (name: keyof TrackFilters) => void;
  filters: TrackFilters;
  setFilters: Dispatch<SetStateAction<TrackFilters>>;
  data: Partial<TracksSliceType["data"]>;
  trackQuery: string | null;
  playlist?: Playlist;
  skeleton?: boolean;
  selectedTracks?: string[];
  setSelectedTracks?: Dispatch<SetStateAction<string[]>>;
  showCaption?: boolean;
  isLoading?: boolean;
};

export function SortTable({
  handleFilterChange,
  filters,
  setFilters,
  data,
  trackQuery,
  playlist,
  skeleton = false,
  selectedTracks,
  showCaption,
  isLoading,
}: SortTableProps) {
  const isMobile = useIsMobile();
  const memoizedTracks = useMemo(() => {
    return !isLoading
      ? sortTracks({
          tracks: data?.tracks ?? [],
          albums: data?.albums,
          authors: data?.authors,
          filters,
          trackQuery,
        })?.map((track, trackIndex) => (
          <Track
            selected={!!selectedTracks?.find((id) => id === track.id)}
            skeleton={skeleton}
            playlist={playlist}
            viewAs={filters.viewAs}
            key={track.id}
            track={{ ...track, trackIndex }}
            authors={data!.authors!.filter(
              (author) =>
                track.authorId === author.id ||
                track.authorIds.includes(author.id),
            )}
            album={data!.albums!.find((album) => track.albumId === album.id)}
          />
        ))
      : Array.from({ length: 5 }).map((_, i) => (
          <Track viewAs="LIST" skeleton key={i} />
        ));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, filters, trackQuery, playlist]);
  return (
    <>
      {(data?.tracks?.length ?? 0) === 0 && showCaption && (
        <TableCaption>No tracks in this playlist.</TableCaption>
      )}
      <TableHeader>
        {!isMobile && <TableRow>
          <TableHead className="w-0 pl-4 pr-0">#</TableHead>
          <DoubleFilter
            handleFilterChange={handleFilterChange}
            filters={filters}
            setFilters={setFilters}
          />
          <FilterButton
            filters={filters}
            handleFilterChange={handleFilterChange}
            setFilters={setFilters}
            title="Album"
            propertyName="album"
          />
          <FilterButton
            filters={filters}
            handleFilterChange={handleFilterChange}
            setFilters={setFilters}
            title="Date Added"
            propertyName="dateAdded"
            className="w-32"
          />
          <FilterButton
            filters={filters}
            handleFilterChange={handleFilterChange}
            setFilters={setFilters}
            title={<BsClock size={15} />}
            propertyName="duration"
            className="w-10"
          />
        </TableRow>}
      </TableHeader>
      <TableBody>{memoizedTracks}</TableBody>
    </>
  );
}
