import { TracksListSkeleton } from "@/components/artist/components/skeleton";
import { NonSortTable } from "@/components/components/non-sort-table";
import { Table } from "@/components/ui/table";
import { getTracksBySearchQuery } from "@/server/queries/track";
import { type TracksSliceType } from "@/state/slices/tracks";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import { useIntersectionObserver } from "usehooks-ts";

type TracksContentProps = {
  tracks: TracksSliceType["data"];
  query: string;
};

export function TracksContent({ tracks, query }: TracksContentProps) {
  const { isIntersecting, ref } = useIntersectionObserver({
    threshold: 0.2,
  });
  const currentTracksLength = useRef(tracks?.tracks?.length);
  const { isLoading, data, refetch } = useQuery({
    queryKey: [`tracks-tab-${query}`],
    queryFn: async () => {
      const fetchedTracks = await getTracksBySearchQuery({
        query,
        amount: currentTracksLength.current ?? 0 + 10,
        restartLength: 1,
      });
      return fetchedTracks;
    },
  });
  useEffect(() => {
    if (!isIntersecting) return;
    void refetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isIntersecting]);
  return (
    <div className="flex flex-col">
      <Table>
        <NonSortTable
          viewAs="LIST"
          data={!data ? tracks : data}
          replacePlaysWithPlaylist
          intersectLastElementRef={ref}
        />
      </Table>
      {isLoading && <TracksListSkeleton amount={5} />}
    </div>
  );
}
