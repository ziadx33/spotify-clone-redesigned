import { Track } from "@/components/(routes)/(app)/playlist/[playlistId]/components/track";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getPopularTracks } from "@/server/actions/track";
import { type User } from "@prisma/client";
import { BsClock } from "react-icons/bs";

export async function PopularTracks({ artist }: { artist: User }) {
  const { tracks, authors } = await getPopularTracks({
    artistId: artist.id,
    range: { from: 0, to: 10 },
  });
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
          {tracks?.map((track, trackIndex) => (
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
