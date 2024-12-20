"use client";

import { ScrollArea } from "../../ui/scroll-area";
import { PlaylistSection } from "./components/playlists-section";

export function Sidebar() {
  return (
    <ScrollArea
      className={
        "relative z-10 h-full w-full overflow-hidden bg-background py-2"
      }
    >
      <PlaylistSection />
    </ScrollArea>
  );
}
