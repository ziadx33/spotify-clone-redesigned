import { NonSortTable } from "@/components/components/non-sort-table";
import { type getRecommendedTracks } from "@/server/actions/track";
import { type Playlist, type Track } from "@prisma/client";
import { Table } from "@/components/ui/table";
import { type User } from "next-auth";
import { notFound } from "next/navigation";
import { useMemo } from "react";
import { type TablePropsType } from "./recommended";
import { TracksListSkeleton } from "@/components/artist/components/skeleton";

type RecommendedTracksProps = {
  playlist?: Playlist | null;
  tableProps: TablePropsType;
  artists?: User[] | null;
  tracks?: Track[] | null;
  data?: Awaited<ReturnType<typeof getRecommendedTracks>>;
  isLoading: boolean;
  addTrackToPlaylistFn: (track: Track) => Promise<void>;
};

export function RecommendedTracks({
  data,
  tableProps,
  tracks,
  isLoading,
  addTrackToPlaylistFn,
}: RecommendedTracksProps) {
  const tableData = useMemo(() => {
    if (!data && !isLoading) notFound();
    return {
      ...data,
      tracks: data?.tracks?.filter(
        (track) => !tracks?.map((track) => track.id).includes(track.id),
      ),
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading, tracks]);

  return (
    <>
      <div className="mb-4 flex flex-col">
        <b className="text-3xl">Recommended</b>
        <p className="text-sm text-muted-foreground">
          Based on what&apos;s in this playlist
        </p>
      </div>
      <Table>
        {!isLoading ? (
          <NonSortTable
            {...tableProps}
            data={tableData}
            replaceDurationWithButton={{
              name: "add",
              fn: addTrackToPlaylistFn,
            }}
          />
        ) : (
          <TracksListSkeleton amount={5} />
        )}
      </Table>
    </>
  );
}
