import { NonSortTable } from "@/components/components/non-sort-table";
import Loading from "@/components/ui/loading";
import { type getRecommendedTracks } from "@/server/actions/track";
import { type Playlist, type Track } from "@prisma/client";
import { Table } from "@/components/ui/table";
import { type User } from "next-auth";
import { notFound } from "next/navigation";
import { useMemo } from "react";
import { type TablePropsType } from "./recommended";

type RecommendedTracksProps = {
  playlist?: Playlist;
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

  if (isLoading) return <Loading className="h-96" />;

  return (
    <>
      <div className="mb-4 flex flex-col">
        <b className="text-3xl">Recommended</b>
        <p className="text-sm text-muted-foreground">
          Based on what&apos;s in this playlist
        </p>
      </div>
      <Table>
        <NonSortTable
          {...tableProps}
          data={tableData}
          replaceDurationWithButton={{
            name: "add",
            fn: addTrackToPlaylistFn,
          }}
        />
      </Table>
    </>
  );
}
