import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { useDebounceState } from "@/hooks/use-debounce-state";
import { useQueue } from "@/hooks/use-queue";
import { PiSpeakerLowBold } from "react-icons/pi";

export function QueueVolumeSlider({ defaultValue }: { defaultValue: number }) {
  const {
    editQueueListFn,
    data: { data },
  } = useQueue();
  const [value, setValue] = useDebounceState([defaultValue ?? 0], ([value]) => {
    void editQueueListFn({
      queueListData: data!.queueList,
      editData: { volumeLevel: value },
    }).runBoth();
  });
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
