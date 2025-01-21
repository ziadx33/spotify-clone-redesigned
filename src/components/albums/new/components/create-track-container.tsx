import { Button } from "@/components/ui/button";
import { type TracksSliceType } from "@/state/slices/tracks";
import type { MutableRefObject, Dispatch, SetStateAction } from "react";
import { FaPlus } from "react-icons/fa";
import { TrackForm } from "./track-form";

type CreateTrackContainerProps = {
  tempTracksNum: { id: string; edit: boolean }[];
  setTempTracksNum: Dispatch<SetStateAction<{ id: string; edit: boolean }[]>>;
  tracks: TracksSliceType["data"];
  setTracks: Dispatch<SetStateAction<TracksSliceType["data"]>>;
  editedTrackIds: MutableRefObject<string[]>;
};

export function CreateTrackContainer({
  tempTracksNum,
  setTempTracksNum,
  setTracks,
  tracks,
  editedTrackIds,
}: CreateTrackContainerProps) {
  return (
    <div className="flex flex-col gap-2">
      {tempTracksNum.map((item) => (
        <TrackForm
          key={item.id}
          item={item}
          setTracks={setTracks}
          tracks={tracks}
          setTempTracksNum={setTempTracksNum}
          editedTrackIds={editedTrackIds}
        />
      ))}
      <Button
        className="w-full"
        variant="outline"
        onClick={() =>
          setTempTracksNum([
            ...tempTracksNum,
            { id: crypto.randomUUID(), edit: false },
          ])
        }
      >
        <FaPlus />
      </Button>
    </div>
  );
}
