import { MusicPlayer } from "@/components/[playlistId]/components/music-player";
import { DialogContent } from "@/components/ui/dialog";
import { type TracksSliceType, setTracks } from "@/state/slices/tracks";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

type PlaylistDialogProps = {
  isActive: boolean;
} & NonNullable<TracksSliceType["data"]>;

export function PlaylistDialog({ isActive, ...data }: PlaylistDialogProps) {
  const dispatch = useDispatch();
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
      <MusicPlayer showTrackImage />
    </DialogContent>
  );
}
