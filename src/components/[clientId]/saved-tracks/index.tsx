import { Button } from "@/components/ui/button";
import { type User } from "@prisma/client";
import { FaPlay } from "react-icons/fa";
import { type getSavedTracks } from "@/server/actions/track";
import { Table } from "@/components/ui/table";
import { NonSortTable } from "../../components/non-sort-table";

type SavedTracksProps = {
  data: Awaited<ReturnType<Awaited<typeof getSavedTracks>>>;
  artist: User;
};

export function SavedTracks({ data, artist }: SavedTracksProps) {
  return (
    <div className="flex flex-col p-4">
      <div className="mb-4 flex items-center">
        <Button size={"icon"} className="mr-2.5 h-14 w-14 rounded-full">
          <FaPlay size={18} />
        </Button>
        <span className="text-2xl font-bold">
          Saved Tracks By {artist.name}
        </span>
      </div>
      <Table>
        <NonSortTable data={data.data} viewAs="LIST" />
      </Table>
    </div>
  );
}
