import { Button } from "@/components/ui/button";
import { CgPlayButtonR } from "react-icons/cg";
import { HiOutlineQueueList } from "react-icons/hi2";
import { QueueVolumeSlider } from "./queue-volume-slider";
import { useMiniMenu } from "@/hooks/use-mini-menu";
import { FullViewButton } from "./full-view-button";
import { cn } from "@/lib/utils";

type PlayControlsProps = {
  volumeLevel: number;
  className?: string;
};

export function PlayControls({ volumeLevel, className }: PlayControlsProps) {
  const { setShowMenu, enableButton, showQueue, value } = useMiniMenu();
  return (
    <div className={cn("flex w-fit items-center gap-2", className)}>
      <Button
        size="icon"
        disabled={!enableButton}
        onClick={() => setShowMenu((v) => !v, false)}
        variant={!showQueue && value ? "secondary" : "outline"}
      >
        <CgPlayButtonR />
      </Button>
      <Button
        size="icon"
        onClick={() => setShowMenu(true, (v) => !v)}
        variant={!showQueue ? "outline" : "secondary"}
      >
        <HiOutlineQueueList />
      </Button>
      <QueueVolumeSlider defaultValue={volumeLevel} />
      <FullViewButton />
    </div>
  );
}
