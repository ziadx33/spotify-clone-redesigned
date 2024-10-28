import { AvatarData } from "@/components/avatar-data";
import { CircleItems } from "@/components/ui/circle-items";
import { useQueue } from "@/hooks/use-queue";
import Image from "next/image";
import Link from "next/link";
import { memo } from "react";
import { QueueProgressBar } from "./queue-progress-bar";
import { PlayControls } from "./play-controls";
import { useQueueController } from "@/hooks/use-queue-controller";

export function Comp() {
  const { currentQueue, getTrack, currentData } = useQueue();
  const currentTrack = getTrack(currentQueue?.queueData?.currentPlaying);

  const { isLastTrack, nextQueue: nextQueueData } = currentData || {};

  const id =
    currentQueue?.queueData?.trackList.indexOf(
      currentQueue?.queueData?.currentPlaying,
    ) ?? 0;

  const nextTrack = getTrack(
    !isLastTrack
      ? currentQueue?.queueData?.trackList[id + 1]
      : nextQueueData?.queueData?.trackList?.[0],
    isLastTrack ? nextQueueData?.queueData?.id : undefined,
  );

  const {
    data: { volume: volumeLevel },
  } = useQueueController();

  return (
    <div className="absolute inset-0 z-50 flex size-full flex-col justify-between bg-background p-12">
      {currentTrack?.author?.coverImage && (
        <>
          <Image
            src={currentTrack.author.coverImage}
            fill
            alt="Cover Image"
            className="h-full max-w-full object-cover"
            draggable="false"
          />
          <div className="absolute inset-0 z-10 bg-black opacity-50"></div>
        </>
      )}

      <div className="flex w-full justify-between">
        <h1 className="relative z-20 text-2xl font-semibold text-white">
          PLAYING FROM PLAYLIST <br />
          <span className="text-xl">
            {currentQueue?.artistTypeData?.name ??
              currentQueue?.playlistTypeData?.title}
          </span>
        </h1>

        {nextTrack.track && (
          <div className="z-50 flex h-fit min-h-24 w-96 gap-3 overflow-hidden rounded-lg border  bg-card">
            <AvatarData
              containerClasses="relative h-full max-h-24 w-24 rounded-none rounded-br-lg"
              alt={nextTrack.track?.title}
              src={nextTrack.track?.imgSrc ?? ""}
            />
            <div className="flex flex-col py-4">
              <h3 className="mb-2">UP NEXT</h3>
              <CircleItems
                className="flex flex-wrap text-xl font-bold uppercase text-white"
                items={[nextTrack.track?.title, nextTrack.author?.name]}
              />
            </div>
          </div>
        )}
      </div>
      <div className="z-50 flex flex-col gap-12">
        <div className="flex items-end gap-10">
          <AvatarData
            containerClasses="size-80 rounded-lg"
            src={currentTrack.track?.imgSrc}
            alt={currentTrack.track?.title}
          />
          <div className="flex flex-col gap-3">
            <h1 className="text-8xl font-bold">{currentTrack.track?.title}</h1>
            <Link
              href={`/artist/${currentTrack.author?.id}?playlist=${currentTrack.track?.albumId}`}
              className="text-xl font-bold text-muted-foreground"
            >
              {currentTrack.author?.name}
            </Link>
          </div>
        </div>
        <div>
          <div className="flex flex-col-reverse gap-6">
            <QueueProgressBar
              handleQueueControls={(children) => {
                return (
                  <div className="relative flex h-12 items-center">
                    <div className="absolute left-1/2 -translate-x-1/2">
                      {children}
                    </div>
                    <PlayControls
                      volumeLevel={volumeLevel}
                      className="absolute right-0"
                    />
                  </div>
                );
              }}
              queueControlsClassName="justify-center"
              progressClassName="w-full"
              duration={currentTrack.track?.duration}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export const FullTrackView = memo(Comp);
