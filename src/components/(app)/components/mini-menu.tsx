"use client";

import { useMiniMenu } from "@/hooks/use-mini-menu";

import { ScrollArea } from "@/components/ui/scroll-area";
import { MiniMenuArtistInfo } from "./mini-menu-artist-info";
import { MiniMenuTrackInfo } from "./mini-menu-track-info";
import { MiniMenuCreditsSection } from "./mini-menu-credits-section";
import { QueueMenu } from "./queue-menu";
import { MiniMenuNextQueue } from "./mini-menu-next-queue";

export function MiniMenu() {
  const { value, showQueue } = useMiniMenu();
  return value ? (
    <>
      <div className="h-full w-[38%] px-2 pb-2 pl-4">
        <ScrollArea className="border-lg flex size-full flex-col items-center overflow-hidden rounded-lg bg-muted/40">
          {!showQueue ? <Menu /> : <QueueMenu />}
        </ScrollArea>
      </div>
    </>
  ) : null;
}

function Menu() {
  return (
    <>
      <MiniMenuTrackInfo />
      <MiniMenuArtistInfo />
      <MiniMenuCreditsSection />
      <MiniMenuNextQueue />
      <div className="h-6 w-full" />
    </>
  );
}
