import { Button } from "@/components/ui/button";
import { TbBooks } from "react-icons/tb";
import { PlaylistFilters } from "./playlists-filters";
import { SlMagnifier } from "react-icons/sl";
import { FiPlus } from "react-icons/fi";

export async function PlaylistSection() {
  return (
    <div className="px-4">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex gap-2 text-lg font-semibold">
          <TbBooks size={30} />
          <h3>Your library</h3>
        </div>

        <div>
          <Button size="icon" variant="ghost">
            <FiPlus className="font-bold" />
          </Button>
          <Button size="icon" variant="ghost">
            <SlMagnifier className="font-bold" />
          </Button>
        </div>
      </div>
      <PlaylistFilters />
    </div>
  );
}
