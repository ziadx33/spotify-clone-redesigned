import { type getUserTopTracks } from "@/server/actions/track";
import { NonSortTable } from "../components/non-sort-table";
import { Table } from "../ui/table";

type TopTracksProps = {
  tracks?: Awaited<ReturnType<typeof getUserTopTracks>>["data"] | null;
};

export function TopTracks({ tracks }: TopTracksProps) {
  return (
    <div className="flex flex-col gap-6 px-6">
      <h1 className="pt-8 text-3xl font-bold">Top tracks this month</h1>

      <Table>
        <NonSortTable
          replacePlaysWithPlaylist
          viewAs="LIST"
          isLoading={!tracks}
          data={tracks}
        />
      </Table>
    </div>
  );
}
