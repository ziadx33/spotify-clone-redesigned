"use client";

import { ScrollArea } from "../../ui/scroll-area";
import { PlaylistSection } from "./components/playlists-section";
import { cn } from "@/lib/utils";
import { usePrefrences } from "@/hooks/use-prefrences";

export function Sidebar() {
  const { data } = usePrefrences();
  return (
    <ScrollArea
      className={cn(
        "relative z-10 h-full overflow-hidden bg-background p-2",
        !data?.showSidebar ? "w-[20%]" : "w-28",
      )}
    >
      <PlaylistSection />
    </ScrollArea>
  );
}
