import { TableCell } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { type Playlist } from "@prisma/client";
import { type ReactNode } from "react";
import Image from "next/image";
import { SkeletonList } from "@/components/artist/components/skeleton";
import { Skeleton } from "@/components/ui/skeleton";
import { PlayButton } from "./play-button";
import { type Props as TrackProps } from "../types";
import { useQueueController } from "@/hooks/use-queue-controller";

export type IndexImageProps = {
  track?: TrackProps["track"];
  showImage?: boolean;
  skeleton: boolean;
  authorsElement: ReactNode;
  isList: boolean;
  className?: string;
  showIndex?: boolean;
  showButtons: boolean;
  hidePlayButton?: boolean;
  album?: Playlist;
  queueTypeId?: string;
};

export function IndexImage({
  track,
  showImage,
  skeleton,
  isList,
  className,
  authorsElement,
  showIndex,
  showButtons,
  hidePlayButton,
  album,
  queueTypeId,
}: IndexImageProps) {
  const {
    data: { currentTrackId },
  } = useQueueController();
  const playButton = !skeleton ? (
    <PlayButton
      showButtons={showButtons}
      skeleton={skeleton}
      track={track!}
      playlist={album}
      queueTypeId={queueTypeId}
      trackIndex={track!.trackIndex}
    />
  ) : null;
  const content = (
    <>
      {!skeleton
        ? showIndex && (
            <TableCell className="w-12 pl-4 pr-4">{playButton}</TableCell>
          )
        : undefined}
      <TableCell className={cn("font-medium", className)}>
        <div className="flex w-full gap-2">
          {isList &&
            showImage &&
            (!skeleton ? (
              <div className="relative size-[40px]">
                <Image
                  src={track!.imgSrc}
                  fill
                  alt={track!.title}
                  className="rounded-sm"
                />{" "}
                {!showIndex && showButtons && (
                  <div className="absolute left-0 top-0 grid size-full place-items-center bg-black bg-opacity-80">
                    {playButton}
                  </div>
                )}
              </div>
            ) : (
              <Skeleton className="size-[40px]" />
            ))}
          <div>
            {!skeleton ? (
              <h3
                className={currentTrackId === track!.id ? "text-primary" : ""}
              >
                {track!.title}
              </h3>
            ) : (
              <Skeleton className="h-2.5 w-28" />
            )}
            {isList &&
              (!skeleton ? (
                <div className="flex w-fit gap-1">{authorsElement}</div>
              ) : (
                <div className="flex gap-1">
                  <SkeletonList amount={2} className="mt-2 h-2.5 w-10" />
                </div>
              ))}
          </div>
        </div>
      </TableCell>
    </>
  );
  return hidePlayButton ? <div className="w-96">{content}</div> : content;
}
