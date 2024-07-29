import { Track } from "@/components/components/track";
import { Table, TableBody } from "@/components/ui/table";
import { type getPopularTracks } from "@/server/actions/track";

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
