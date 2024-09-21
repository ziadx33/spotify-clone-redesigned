import { Button } from "@/components/ui/button";
import { CgPlayButtonR, CgMinimize } from "react-icons/cg";
import { HiOutlineQueueList } from "react-icons/hi2";
import { PiArrowsOutSimpleBold } from "react-icons/pi";
import { QueueVolumeSlider } from "./queue-volume-slider";
import { useMiniMenu } from "@/hooks/use-mini-menu";

export function PlayControls({ volumeLevel }: { volumeLevel: number }) {
  const { setShowMenu, enableButton, showQueue, value } = useMiniMenu();
  return (
    <div className="flex w-fit items-center gap-2">
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
      <Button size="icon" variant="outline">
        <CgMinimize />
      </Button>
      <Button size="icon" variant="outline">
        <PiArrowsOutSimpleBold />
      </Button>
    </div>
  );
}
