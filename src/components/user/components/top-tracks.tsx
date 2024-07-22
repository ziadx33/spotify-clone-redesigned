import { NonSortTable } from "@/components/components/non-sort-table";
import { Button } from "@/components/ui/button";
import { Table } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { type TracksSliceType } from "@/state/slices/tracks";
import { type User } from "@prisma/client";
import Link from "next/link";

type TopTracksProps = {
  data: TracksSliceType["data"];
  user?: User;
};

export function TopTracks({ data, user }: TopTracksProps) {
  const tracks = data?.tracks ?? [];
  const showMoreButton = tracks.length >= 4;
  return (
    <div className="w-full flex-col">
      <div className="flex items-center justify-between">
        <Button
          variant="link"
          className={cn(
            "mb-4 pl-0 text-3xl font-semibold text-white",
            showMoreButton
              ? "hover:underline"
              : " cursor-default hover:no-underline",
          )}
          asChild={showMoreButton}
        >
          {showMoreButton ? (
            <Link href={`/artist/${user?.id}/top-tracks`}>
              Top tracks this month
            </Link>
          ) : (
            "Top tracks this month"
          )}
        </Button>
        {showMoreButton && (
          <Button asChild variant="link">
            <Link href={`/artist/${user?.id}/top-tracks`}>show more</Link>
          </Button>
        )}
      </div>

      <Table>
        <NonSortTable
          replacePlaysWithPlaylist
          showHead={false}
          viewAs="LIST"
          limit={4}
          data={{
            ...data,
            tracks: tracks,
          }}
        />
      </Table>
    </div>
  );
}
