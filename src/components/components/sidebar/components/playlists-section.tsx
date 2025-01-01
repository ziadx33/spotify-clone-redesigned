import { TbBooks } from "react-icons/tb";
import { PlaylistsSectionContainer } from "./playlists-section-container";
import { useUserData } from "@/hooks/use-user-data";
import { SidebarList } from "./sidebar-list";

export function PlaylistSection() {
  const user = useUserData();
  return (
    <PlaylistsSectionContainer>
      <div className="mb-4 flex items-center justify-between px-2">
        <button
          disabled={!user?.id}
          className="flex gap-2 text-lg font-semibold"
        >
          <TbBooks size={30} />
          <h3>Your library</h3>
        </button>
      </div>
      <div className="flex w-full flex-col">
        <SidebarList />
      </div>
    </PlaylistsSectionContainer>
  );
}
