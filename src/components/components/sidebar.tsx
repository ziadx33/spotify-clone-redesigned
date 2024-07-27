import { PlaylistSection } from "./playlists-section";

export function Sidebar() {
  return (
    <aside className="relative z-10 h-full w-[20%] bg-background p-2">
      <PlaylistSection />
    </aside>
  );
}
