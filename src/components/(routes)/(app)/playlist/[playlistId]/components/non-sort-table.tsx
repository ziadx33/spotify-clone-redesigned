import {
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
} from "@/components/ui/table";
import { type TracksSliceType } from "@/state/slices/tracks";
import { type Playlist } from "@prisma/client";
import { BsClock } from "react-icons/bs";
import { Track } from "./track";
import { type TrackFilters } from "@/types";

type NonSortTable = {
  data: Partial<TracksSliceType["data"]>;
  playlist: Playlist;
  viewAs: TrackFilters["viewAs"];
};

export function NonSortTable({ data, playlist, viewAs }: NonSortTable) {
  return (
    <>
      <TableHeader>
        <TableRow>
          <TableHead className="w-0 pl-4 pr-0">#</TableHead>
          <TableHead>Title</TableHead>
          <TableHead>Plays</TableHead>
          <TableHead>
            <BsClock size={15} />
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data?.tracks?.map((track, trackIndex) => (
          <Track
            isAlbum
            playlist={playlist}
            viewAs={viewAs}
            key={track.id}
            track={{ ...track, trackIndex }}
            authors={data.authors!.filter(
              (author) =>
                track.authorId === author.id ||
                track.authorIds.includes(author.id),
            )}
            album={data.albums!.find((album) => track.albumId === album.id)}
          />
        ))}
      </TableBody>
    </>
  );
}
