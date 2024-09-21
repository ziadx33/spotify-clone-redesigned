import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { useState } from "react";
import { PiSpeakerLowBold } from "react-icons/pi";

export function QueueVolumeSlider({ defaultValue }: { defaultValue: number }) {
  const [value, setValue] = useState([defaultValue ?? 0]);
  const resetHandler = () => {
    setValue([0]);
  };
  return (
    <div className="mx-2 flex gap-2">
      <Button onClick={resetHandler} size="icon" variant="outline">
        <PiSpeakerLowBold />
      </Button>
      <Slider
        value={value}
        onValueChange={(v) => setValue(v)}
        unselectable="off"
        max={100}
        step={1}
        className="w-28"
      />
    </div>
  );
}
