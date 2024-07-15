import { Track } from "@/components/(routes)/(app)/components/track";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { type getPopularTracks } from "@/server/actions/track";
import { BsClock } from "react-icons/bs";

type PopularTracksProps = {
  data: Awaited<ReturnType<typeof getPopularTracks>>;
};

export async function PopularTracks({
  data: { authors, tracks },
}: PopularTracksProps) {
  return (
    <div className="w-full flex-col">
      <h1 className="mb-4 text-3xl font-semibold">Popular Tracks</h1>
      <Table>
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
          {tracks
            .sort((a, b) => b.plays - a.plays)
            ?.map((track, trackIndex) => (
              <Track
                isAlbum
                viewAs={"LIST"}
                key={track.id}
                track={{ ...track, trackIndex }}
                authors={authors.filter(
                  (author) =>
                    track.authorIds.includes(author.id) ||
                    track.authorId === author.id,
                )}
              />
            ))}
        </TableBody>
      </Table>
    </div>
  );
}
