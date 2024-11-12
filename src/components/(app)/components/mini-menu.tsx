"use client";

import { useMiniMenu } from "@/hooks/use-mini-menu";

import { ScrollArea } from "@/components/ui/scroll-area";
import { MiniMenuArtistInfo } from "./mini-menu-artist-info";
import { MiniMenuTrackInfo } from "./mini-menu-track-info";
import { MiniMenuCreditsSection } from "./mini-menu-credits-section";
import { QueueMenu } from "./queue-menu";
import { MiniMenuNextQueue } from "./mini-menu-next-queue";
import { FullTrackView } from "./full-track-view";
import { usePrefrences } from "@/hooks/use-prefrences";
import { useEffect, useMemo, useRef } from "react";

export function MiniMenu() {
  const { value, showQueue, showFullMenu, setShowMenu, status } = useMiniMenu();
  const { data: prefrences } = usePrefrences();
  const isDone = useRef(false);

  useEffect(() => {
    if (isDone.current) return;
    if (prefrences?.showPlayingView === undefined || status !== "success")
      return;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    setShowMenu(prefrences?.showPlayingView, false);
    isDone.current = true;
  }, [prefrences, prefrences?.showPlayingView, setShowMenu, status]);

  return (
    <>
      <div className={`h-full w-[35%] px-2 pb-2 pl-4 ${value ? "" : "hidden"}`}>
        <ScrollArea className="border-lg flex size-full flex-col items-center overflow-hidden rounded-lg bg-muted/40">
          <div className={!showQueue ? "block" : "hidden"}>{<Menu />}</div>
          <div className={showQueue ? "block" : "hidden"}>{<QueueMenu />}</div>
        </ScrollArea>
      </div>
      {showFullMenu && <FullTrackView />}
    </>
  );
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
