import { useQueue } from "@/hooks/use-queue";
import { type QueueListSliceType } from "@/state/slices/queue-list";
import Image from "next/image";
import { QueueControlsPlayButton } from "./queue-controls-play-button";
import { QueueProgressBar } from "./queue-progress-bar";
import { Drawer, DrawerTrigger } from "@/components/ui/drawer";
import { MobileTrackMenu } from "./mobile-track-menu";

export function MobileQueueController({
  data,
}: {
  data: QueueListSliceType["data"];
}) {
  const { getTrack, getQueue } = useQueue();
  const currentQueue = getQueue(data?.queueList?.currentQueueId);
  const currentTrack = getTrack(currentQueue?.queueData?.currentPlaying ?? "");
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <div className="absolute bottom-[5.8rem] left-1/2 z-50 flex h-14 w-[96%] -translate-x-1/2 gap-2 rounded-lg border bg-background px-2 py-1.5">
          <div className="flex w-full justify-between">
            <div className="flex gap-2">
              {currentTrack.track?.imgSrc && (
                <div className="relative h-full w-11 ">
                  <Image
                    src={currentTrack.track?.imgSrc}
                    fill
                    className="rounded-sm"
                    alt={currentTrack.track?.title ?? ""}
                  />
                </div>
              )}
              <div className="flex flex-col">
                <h3>{currentTrack.track?.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {currentTrack.author?.name}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <QueueControlsPlayButton
                variant="ghost"
                size="icon"
                className="mx-0"
              />
              <QueueProgressBar
                duration={currentTrack?.track?.duration}
                className="hidden"
              />
            </div>
          </div>
        </div>
      </DrawerTrigger>
      <MobileTrackMenu />
    </Drawer>
  );
}
