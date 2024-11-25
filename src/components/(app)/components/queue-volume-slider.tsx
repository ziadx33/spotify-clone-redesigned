import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { useDebounceState } from "@/hooks/use-debounce-state";
import { useQueue } from "@/hooks/use-queue";
import { useQueueController } from "@/hooks/use-queue-controller";
import { editQueueController } from "@/state/slices/queue-controller";
import { type AppDispatch } from "@/state/store";
import { wait } from "@/utils/wait";
import { PiSpeakerLowBold } from "react-icons/pi";
import { useDispatch } from "react-redux";

export function QueueVolumeSlider({ defaultValue }: { defaultValue: number }) {
  const {
    editQueueListFn,
    data: { data },
  } = useQueue();
  const { play, data: queueControllerData, pause } = useQueueController();
  const dispatch = useDispatch<AppDispatch>();
  const [value, setValue] = useDebounceState([defaultValue ?? 0], ([value]) => {
    void editQueueListFn({
      queueListData: data!.queueList,
      editData: { volumeLevel: value },
    }).runBoth();
    const isPlaying = queueControllerData.isPlaying;
    dispatch(editQueueController({ volume: value, isPlaying: false }));
    pause();
    if (!isPlaying) return;
    void wait(100).then(
      () =>
        void play(true, queueControllerData.currentTrackId, undefined, value),
    );
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
