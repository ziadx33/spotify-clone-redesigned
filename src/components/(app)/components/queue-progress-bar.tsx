import { Slider } from "@/components/ui/slider";
import { parseDurationTime } from "@/utils/parse-duration-time";
import { useState } from "react";

type QueueSliderProps = {
  duration?: number;
  defaultValue?: number;
};

export function QueueProgressBar({ duration, defaultValue }: QueueSliderProps) {
  const [value, setValue] = useState([0]);
  return (
    <div className="flex gap-2">
      <h5 className="w-10">{parseDurationTime(value[0])}</h5>
      <Slider
        defaultValue={[defaultValue ?? 0]}
        onValueChange={(v) => setValue(v)}
        max={duration}
        step={1}
        className="w-[30rem]"
      />
      <h5 className="ml-0.5 w-10">{parseDurationTime(duration)}</h5>
    </div>
  );
}
