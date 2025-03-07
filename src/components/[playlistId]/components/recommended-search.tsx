import { NonSortTable } from "@/components/components/non-sort-table";
import { Input } from "@/components/ui/input";
import { type Track } from "@prisma/client";
import { type TablePropsType } from "./recommended";
import { useDebounceState } from "@/hooks/use-debounce-state";
import { Table } from "@/components/ui/table";
import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import Loading from "@/components/ui/loading";
import { useTracks } from "@/hooks/use-tracks";
import { getTracksBySearchQuery } from "@/server/queries/track";

type SearchTrackProps = {
  tableProps: TablePropsType;
  addTrackToPlaylistFn: (track: Track) => Promise<void>;
};

export function SearchTrack({
  tableProps,
  addTrackToPlaylistFn,
}: SearchTrackProps) {
  const {
    data: { data: tracks },
  } = useTracks();
  const [search, setSearch, debounce] = useDebounceState("", () => {
    void refetch();
  });
  const { isLoading, data, refetch } = useQuery({
    queryKey: [],
    queryFn: async () => {
      const data = await getTracksBySearchQuery({
        query: debounce,
        disablePlaylists: true,
      });
      return data;
    },
  });

  const filteredTracks = useMemo(
    () =>
      data?.tracks?.filter(
        (track) => !tracks?.tracks?.map((track) => track.id).includes(track.id),
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [tracks?.tracks, data?.tracks],
  );

  return (
    <div className="mb-4 flex h-fit min-h-[40rem] w-full flex-col">
      <b className="mb-4 text-3xl">
        Let&apos;s find something for your playlist
      </b>
      <Input
        value={search}
        onChange={(v) => setSearch(v.target.value)}
        placeholder="Search for tracks"
        className="mb-4"
      />
      {isLoading ? (
        <Loading className="h-96" />
      ) : filteredTracks?.length ?? 0 > 0 ? (
        <Table className="w-full">
          <NonSortTable
            {...tableProps}
            data={{ ...data, tracks: filteredTracks }}
            replaceDurationWithButton={{
              name: "add",
              fn: addTrackToPlaylistFn,
            }}
          />
        </Table>
      ) : (
        <div className="flex size-full items-center justify-center">
          <b className="text-3xl">
            {debounce === ""
              ? "try searching for something"
              : `No results for ${debounce}`}
          </b>
        </div>
      )}
    </div>
  );
}
