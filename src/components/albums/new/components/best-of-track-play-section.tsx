import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { useAudioControl } from "@/hooks/use-audio-control";
import { parseDurationTime } from "@/utils/parse-duration-time";
import { FaPause, FaPlay } from "react-icons/fa";

type BestOfTrackPlaySectionProps = {
  fileDuration: number;
  file: File;
  startMarker: number;
  endMarker: number;
};

export function BestOfTrackPlaySection({
  fileDuration,
  file,
  startMarker,
  endMarker,
}: BestOfTrackPlaySectionProps) {
  const {
    audioRef,
    currentTime,
    handleSliderChange,
    isPlaying,
    playSelection,
    toggleAudio,
  } = useAudioControl(startMarker, endMarker);
  return (
    <>
      <div className="mt-4 flex items-center gap-2">
        <h5 className="w-10">{parseDurationTime(currentTime)}</h5>
        <Slider
          value={[currentTime]}
          onValueChange={(v) => handleSliderChange(v[0] ?? 0)}
          max={fileDuration}
          className="w-full"
        />
        <h5 className="w-10">{parseDurationTime(fileDuration)}</h5>
      </div>
      <div className="mt-2 flex gap-2">
        <Button onClick={toggleAudio} type="button">
          {isPlaying ? <FaPause /> : <FaPlay />}
        </Button>
        <Button
          onClick={playSelection}
          type="button"
          variant="outline"
          className="w-full"
        >
          Play Selection
        </Button>
      </div>
      <audio ref={audioRef} controls className="invisible absolute -z-10">
        {file && <source src={URL.createObjectURL(file)} />}
      </audio>
    </>
  );
}
