import { Button } from "@/components/ui/button";
import { useQueue } from "@/hooks/use-queue";
import { BsFillSkipBackwardFill, BsFillSkipForwardFill } from "react-icons/bs";
import { FaRandom } from "react-icons/fa";
import { MdOutlineRepeat, MdOutlineRepeatOne } from "react-icons/md";
import { QueueControlsPlayButton } from "./queue-controls-play-button";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

type QueueControlsProps = {
  className?: string;
};

export function QueueControls({ className }: QueueControlsProps) {
  const {
    shuffleQueue,
    repeatQueue,
    skipBy,
    data: { data },
    getCurrentData,
    getQueue,
  } = useQueue();
  const currentQueue = getQueue(data?.queueList.currentQueueId);
  const { isFirstTrack, isLastTrack, nextQueue, isLastQueue } =
    getCurrentData(currentQueue);
  const isMobile = useIsMobile();

  const shuffleHandler = () => {
    void shuffleQueue({ value: (v) => !v });
  };

  const repeatHandler = () => {
    void repeatQueue({
      value: (v) =>
        v === null
          ? "PLAYLIST"
          : v === "PLAYLIST"
            ? "TRACK"
            : v === "TRACK"
              ? null
              : "PLAYLIST",
    });
  };

  const goBackwardHandler = async () => {
    await skipBy(-1);
  };

  const goForwardHandler = async () => {
    await skipBy(
      1,
      nextQueue && isLastTrack ? nextQueue.queueData?.id : undefined,
    );
  };

  return (
    <div className={cn("flex gap-2", className)}>
      <Button
        size="icon"
        variant={data?.queueList.randomize ? "secondary" : "outline"}
        onClick={shuffleHandler}
        className="max-lg:size-14"
      >
        <FaRandom size={!isMobile ? undefined : 23} />
      </Button>
      <Button
        size="icon"
        variant="outline"
        disabled={isFirstTrack}
        onClick={goBackwardHandler}
        className="max-lg:size-14"
      >
        <BsFillSkipBackwardFill size={!isMobile ? undefined : 23} />
      </Button>
      <QueueControlsPlayButton />
      <Button
        size="icon"
        variant="outline"
        disabled={isLastTrack && isLastQueue}
        className="max-lg:size-14"
        onClick={goForwardHandler}
      >
        <BsFillSkipForwardFill size={!isMobile ? undefined : 23} />
      </Button>
      <Button
        size="icon"
        variant={data?.queueList?.repeatQueue ? "secondary" : "outline"}
        onClick={repeatHandler}
        className="max-lg:size-14"
      >
        {data?.queueList.repeatQueue === "PLAYLIST" ? (
          <MdOutlineRepeat size={!isMobile ? 20 : 30} />
        ) : data?.queueList.repeatQueue === "TRACK" ? (
          <MdOutlineRepeatOne size={!isMobile ? 20 : 30} />
        ) : (
          <MdOutlineRepeat size={!isMobile ? 20 : 30} />
        )}
      </Button>
    </div>
  );
}
