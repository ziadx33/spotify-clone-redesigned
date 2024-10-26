import { MusicPlayer } from "@/components/[playlistId]/components/music-player";
import { DialogContent } from "@/components/ui/dialog";
import { type TracksSliceType, setTracks } from "@/state/slices/tracks";
import { type AppDispatch } from "@/state/store";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

type PlaylistDialogProps = {
  isActive: boolean;
  queueTypeId: string;
} & NonNullable<TracksSliceType["data"]>;

export function PlaylistDialog({
  isActive,
  queueTypeId,
  ...data
}: PlaylistDialogProps) {
  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    if (!isActive) return;
    dispatch(
      setTracks({
        status: "success",
        error: null,
        data,
      }),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isActive]);
  return (
    <DialogContent className="max-h-[80%] max-w-[1000px] overflow-auto">
      <MusicPlayer queueTypeId={queueTypeId} showTrackImage />
    </DialogContent>
  );
}
