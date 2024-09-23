import { ScrollArea } from "../ui/scroll-area";
import { PlaylistSection } from "./playlists-section";

export function Sidebar() {
  return (
    <ScrollArea className="relative z-10 h-full w-[20%] overflow-hidden bg-background p-2">
      <PlaylistSection />
    </ScrollArea>
  );
}
