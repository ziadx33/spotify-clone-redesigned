import { Button } from "@/components/ui/button";
import { useQueueController } from "@/hooks/use-queue-controller";
import { FaPlay, FaPause } from "react-icons/fa";
import { useEffect, useRef } from "react";

export function QueueControlsPlayButton() {
  const {
    disablePlayButton: disable,
    data: { isPlaying },
    toggle,
  } = useQueueController();

  const buttonHandler = async () => {
    await toggle();
  };
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.code === "Space" && !disable) {
        event.preventDefault();
        buttonRef.current?.click();
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [disable]);

  return (
    <Button
      ref={buttonRef}
      size="icon"
      onClick={buttonHandler}
      disabled={disable}
      className="mx-2 rounded-full text-primary-foreground"
    >
      {!isPlaying ? <FaPlay /> : <FaPause />}
    </Button>
  );
}
