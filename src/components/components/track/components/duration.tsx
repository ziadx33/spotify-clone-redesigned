import { TableCell } from "@/components/ui/table";
import { type Playlist, type Track } from "@prisma/client";
import { type TrackProps } from "../types";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { parseDurationTime } from "@/utils/parse-duration-time";
import { MoreButtons } from "./more-buttons";

type DurationProps = {
  track?: Track;
  skeleton: boolean;
  replaceDurationWithButton?: TrackProps["replaceDurationWithButton"];
  playlist: Playlist | undefined;
  hideTrackContext?: boolean;
};

export function Duration({
  playlist,
  skeleton,
  track,
  replaceDurationWithButton,
  hideTrackContext,
}: DurationProps) {
  return (
    <TableCell>
      {!replaceDurationWithButton ? (
        !skeleton ? (
          <div className="flex h-full w-24 items-center gap-3">
            {parseDurationTime(track!.duration)}
            {!hideTrackContext && (
              <MoreButtons playlist={playlist} track={track} />
            )}
          </div>
        ) : (
          <Skeleton className="h-2.5 w-24" />
        )
      ) : !skeleton ? (
        <Button
          variant="outline"
          onClick={() => replaceDurationWithButton.fn(track!)}
        >
          {replaceDurationWithButton.name}
        </Button>
      ) : (
        <Skeleton className="h-2.5 w-12" />
      )}
    </TableCell>
  );
}
