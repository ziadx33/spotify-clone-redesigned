import { Button, type ButtonProps } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { useQueueController } from "@/hooks/use-queue-controller";
import { type MouseEvent } from "react";
import { FaPlay, FaPause } from "react-icons/fa";

type QueueControlsPlayButtonProps = ButtonProps;

export function QueueControlsPlayButton(props: QueueControlsPlayButtonProps) {
  const {
    disablePlayButton: disable,
    data: { isPlaying },
    toggle,
  } = useQueueController();
  const isMobile = useIsMobile();

  const buttonHandler = async (e: MouseEvent) => {
    e.stopPropagation();
    await toggle();
  };

  return (
    <Button
      size="icon"
      onClick={buttonHandler}
      disabled={disable}
      className="mx-2 rounded-full text-primary-foreground max-lg:size-14 max-lg:rounded-full"
      {...props}
    >
      {!isPlaying ? (
        <FaPlay size={isMobile ? 20 : undefined} />
      ) : (
        <FaPause size={isMobile ? 20 : undefined} />
      )}
    </Button>
  );
}
