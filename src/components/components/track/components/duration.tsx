import { TableCell } from "@/components/ui/table";
import { type Playlist, type Track } from "@prisma/client";
import { type TrackProps } from "../types";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { parseDurationTime } from "@/utils/parse-duration-time";
import { MoreButtons } from "./more-buttons";
import { useIsMobile } from "@/hooks/use-mobile";

type DurationProps = {
  track?: Track;
  skeleton: boolean;
  replaceDurationWithButton?: TrackProps["replaceDurationWithButton"];
  playlist: Playlist | undefined;
  hideViews?: boolean;
  hideTrackContext?: boolean;
};

export function Duration({
  playlist,
  skeleton,
  track,
  replaceDurationWithButton,
  hideViews,
  hideTrackContext,
}: DurationProps) {
  const isMobile = useIsMobile();
  return (
    !(isMobile && !hideViews) && (
      <TableCell>
        {!replaceDurationWithButton ? (
          !skeleton ? (
            <div className="flex h-full w-24 items-center gap-3">
              <span>{!isMobile && parseDurationTime(track!.duration)}</span>
              {!hideTrackContext && (
                <MoreButtons
                  hideViews={hideViews}
                  playlist={playlist}
                  track={track}
                />
              )}
            </div>
          ) : (
            <Skeleton className="h-2.5 w-24 max-lg:w-6" />
          )
        ) : !skeleton ? (
          typeof replaceDurationWithButton !== "function" ? (
            <Button
              variant="outline"
              onClick={() => replaceDurationWithButton.fn(track!)}
            >
              {replaceDurationWithButton.name}
            </Button>
          ) : (
            <>{replaceDurationWithButton(track!)}</>
          )
        ) : (
          <Skeleton className="h-2.5 w-6" />
        )}
      </TableCell>
    )
  );
}
