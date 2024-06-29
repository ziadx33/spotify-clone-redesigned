import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
} from "@/components/ui/table";
import { useTracks } from "@/hooks/use-tracks";
import { BsClock } from "react-icons/bs";
import { Track } from "./track";

export function Tracks({ id }: { id: string }) {
  const { data } = useTracks({ albumId: id });
  console.log("tracks", data.tracks);
  console.log("authors", data.authors);

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px] pl-8">#</TableHead>
          <TableHead className="w-[100px]">Title</TableHead>
          <TableHead>Album</TableHead>
          <TableHead>Date Added</TableHead>
          <TableHead className="text-right">
            <BsClock />
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data?.tracks?.map((track, trackIndex) => (
          <Track
            key={track.id}
            track={{ ...track, trackIndex }}
            author={
              data.authors!.find((author) => track.authorId === author.id)!
            }
            album={data.albums!.find((album) => track.albumId === album.id)!}
          />
        ))}
      </TableBody>
    </Table>
  );
}
