import { type getUserTopTracks } from "@/server/actions/track";
import { NonSortTable } from "../components/non-sort-table";
import { Table } from "../ui/table";

type FansLikeProps = {
  tracks: Awaited<ReturnType<typeof getUserTopTracks>>["data"];
};

export function TopTracks({ tracks }: FansLikeProps) {
  return (
    <div className="flex flex-col gap-6 p-6  pt-14">
      <h1 className="pt-8 text-3xl font-bold">Top tracks this month</h1>

      <Table>
        <NonSortTable replacePlaysWithPlaylist viewAs="LIST" data={tracks} />
      </Table>
    </div>
  );
}
