import { Track, type TrackProps } from "@/components/components/track";
import { Table, TableBody } from "@/components/ui/table";
import { type Track as TrackType, type User } from "@prisma/client";
import { TracksListSkeleton } from "./skeleton";

export type RenderTracksProps = {
  data?: { authors: User[]; tracks: TrackType[] };
  title: string;
  tracksProps?: Partial<TrackProps>;
  loading?: boolean;
};

export function RenderTracks({
  data,
  title,
  tracksProps,
  loading,
}: RenderTracksProps) {
  return !loading ? (
    <div className="w-full flex-col">
      <h1 className="mb-4 text-3xl font-semibold">{title}</h1>
      <Table>
        <TableBody>
          {data!.tracks
            ?.sort((a, b) => b.plays - a.plays)
            ?.map((track, trackIndex) => (
              <Track
                {...tracksProps}
                skeleton={false}
                isAlbum
                viewAs={"LIST"}
                key={track.id}
                track={{ ...track, trackIndex }}
                authors={data!.authors.filter(
                  (author) =>
                    track.authorIds.includes(author.id) ||
                    track.authorId === author.id,
                )}
              />
            ))}
        </TableBody>
      </Table>
    </div>
  ) : (
    <TracksListSkeleton title={title} amount={5} />
  );
}
