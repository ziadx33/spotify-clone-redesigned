import { MusicPlayer } from "@/components/[playlistId]/components/music-player";
import { DialogContent, DialogTitle } from "@/components/ui/dialog";
import { type TracksSliceType, setTracks } from "@/state/slices/tracks";
import { type AppDispatch } from "@/state/store";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

type PlaylistDialogProps = {
  isActive: boolean;
  queueTypeId: string;
  data?: NonNullable<TracksSliceType["data"]>;
  isLoading?: boolean;
};

export function PlaylistDialog({
  isActive,
  queueTypeId,
  isLoading,
  data,
}: PlaylistDialogProps) {
  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    if (!isActive && isLoading) return;
    dispatch(
      setTracks({
        status: "success",
        error: null,
        data: data!,
      }),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isActive, isLoading]);
  return (
    <DialogContent className="max-h-[80%] max-w-[1000px] overflow-auto">
      <DialogTitle />
      <MusicPlayer
        showExploreButton={false}
        queueTypeId={queueTypeId}
        showTrackImage
      />
    </DialogContent>
  );
}
