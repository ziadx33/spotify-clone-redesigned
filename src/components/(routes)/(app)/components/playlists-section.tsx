import { TbBooks } from "react-icons/tb";
import { PlaylistFilters } from "./playlists-filters";
import { CreatePlaylistButton } from "./create-playlist-button";

export async function PlaylistSection() {
  return (
    <div className="px-4">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex gap-2 text-lg font-semibold">
          <TbBooks size={30} />
          <h3>Your library</h3>
        </div>
        <CreatePlaylistButton />
      </div>
      <PlaylistFilters />
    </div>
  );
}
