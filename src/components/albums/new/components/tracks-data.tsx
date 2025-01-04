import { type TracksSliceType } from "@/state/slices/tracks";
import { getTime } from "@/utils/get-time";
import { type Playlist } from "@prisma/client";
import { format } from "date-fns";
import { useMemo } from "react";
import { FaCircle } from "react-icons/fa";

type TracksDataProps = {
  tracks: TracksSliceType["data"];
  data: Omit<Playlist, "id">;
};

export function TracksData({ tracks, data }: TracksDataProps) {
  const tracksTime = useMemo(() => {
    const seconds = tracks?.tracks
      ?.map((track) => track.duration)
      .reduce((a, b) => a + b, 0);
    return getTime(seconds ?? 0);
  }, [tracks]);
  return (
    <span className="flex items-center gap-1.5">
      {(tracks?.tracks?.length ?? 0) > 0 && (
        <>
          <span className="text-muted-foreground">
            {format(new Date(data.createdAt), "YYY")}
          </span>
          <FaCircle size="5" className="text-muted-foreground" />
          <span className="text-muted-foreground">
            {tracks?.tracks?.length} tracks{" "}
          </span>
          <FaCircle size="5" className="text-muted-foreground" />
          <span className="text-muted-foreground">{tracksTime}</span>
        </>
      )}
    </span>
  );
}
