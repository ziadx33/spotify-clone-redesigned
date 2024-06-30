import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
} from "@/components/ui/table";
import { useTracks } from "@/hooks/use-tracks";
import { Track } from "./track";
import { type TrackFilters } from "@/types";
import { useMemo, type Dispatch, type SetStateAction } from "react";
import { FilterButton } from "./filter-button";
import { BsClock } from "react-icons/bs";
import { DoubleFilter } from "./double-filter";
import { sortTracks } from "@/utils/(routes)/home/[playlistId]/sort-tracks";

type TracksProps = {
  id: string;
  filters: TrackFilters;
  setFilters: Dispatch<SetStateAction<TrackFilters>>;
  handleFilterChange: (name: keyof TrackFilters) => void;
  trackQuery: string | null;
};

export function Tracks({
  id,
  filters,
  setFilters,
  handleFilterChange,
  trackQuery,
}: TracksProps) {
  const { data } = useTracks({ albumId: id });
  const memoizedTracks = useMemo(() => {
    return sortTracks({
      tracks: data?.tracks,
      albums: data?.albums,
      authors: data?.authors,
      filters,
      trackQuery,
    })?.map((track, trackIndex) => (
      <Track
        viewAs={filters.viewAs}
        key={track.id}
        track={{ ...track, trackIndex }}
        author={data.authors!.find((author) => track.authorId === author.id)!}
        album={data.albums!.find((album) => track.albumId === album.id)!}
      />
    ));
  }, [data?.tracks, data.albums, data.authors, filters, trackQuery]);
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px] pl-8">#</TableHead>
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
        </TableRow>
      </TableHeader>
      <TableBody>{memoizedTracks}</TableBody>
    </Table>
  );
}
