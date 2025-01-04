import { Button } from "@/components/ui/button";
import { type TracksSliceType } from "@/state/slices/tracks";
import { type Dispatch, type SetStateAction } from "react";
import { FaPlus } from "react-icons/fa";
import { TrackForm } from "./track-form";

type CreateTrackContainerProps = {
  tempTracksNum: string[];
  setTempTracksNum: Dispatch<SetStateAction<string[]>>;
  tracks: TracksSliceType["data"];
  setTracks: Dispatch<SetStateAction<TracksSliceType["data"]>>;
};

export function CreateTrackContainer({
  tempTracksNum,
  setTempTracksNum,
  setTracks,
  tracks,
}: CreateTrackContainerProps) {
  return (
    <div className="flex flex-col gap-2">
      {tempTracksNum.map((item) => (
        <TrackForm
          key={item}
          item={item}
          setTracks={setTracks}
          tracks={tracks}
          setTempTracksNum={setTempTracksNum}
        />
      ))}
      <Button
        className="w-full"
        variant="outline"
        onClick={() =>
          setTempTracksNum([...tempTracksNum, crypto.randomUUID()])
        }
      >
        <FaPlus />
      </Button>
    </div>
  );
}
