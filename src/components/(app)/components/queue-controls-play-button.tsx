import { Button } from "@/components/ui/button";
import { useQueueController } from "@/hooks/use-queue-controller";
import { editQueueController } from "@/state/slices/queue-controller";
import { type AppDispatch } from "@/state/store";
import { FaPlay, FaPause } from "react-icons/fa";
import { useDispatch } from "react-redux";

export function QueueControlsPlayButton({ value }: { value: number }) {
  const dispatch = useDispatch<AppDispatch>();
  const {
    disablePlayButton: disable,
    data: { progress, isPlaying },
    toggle,
  } = useQueueController();
  const buttonHandler = async () => {
    dispatch(editQueueController({ progress: value }));
    await toggle();
  };
  return (
    <Button
      size="icon"
      onClick={buttonHandler}
      disabled={disable}
      className="mx-2 rounded-full text-primary-foreground"
    >
      {!isPlaying ? <FaPlay /> : <FaPause />}
    </Button>
  );
}
