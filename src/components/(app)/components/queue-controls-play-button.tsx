import { Button } from "@/components/ui/button";
import { useQueueController } from "@/hooks/use-queue-controller";
import { FaPlay, FaPause } from "react-icons/fa";

export function QueueControlsPlayButton() {
  const {
    disablePlayButton: disable,
    data: { isPlaying },
    toggle,
  } = useQueueController();

  const buttonHandler = async () => {
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
