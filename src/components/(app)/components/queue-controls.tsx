import { Button } from "@/components/ui/button";
import { useQueue } from "@/hooks/use-queue";
import { BsFillSkipBackwardFill, BsFillSkipForwardFill } from "react-icons/bs";
import { FaRandom } from "react-icons/fa";
import { MdOutlineRepeat, MdOutlineRepeatOne } from "react-icons/md";
import { QueueControlsPlayButton } from "./queue-controls-play-button";

export function QueueControls() {
  const {
    shuffleQueue,
    repeatQueue,
    skipBy,
    currentData: { isFirstTrack, isLastTrack, nextQueue },
    data: { data },
  } = useQueue();

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
    <div className="flex gap-2">
      <Button
        size="icon"
        variant={data?.queueList.randomize ? "secondary" : "outline"}
        onClick={shuffleHandler}
      >
        <FaRandom />
      </Button>
      <Button
        size="icon"
        variant="outline"
        disabled={isFirstTrack}
        onClick={goBackwardHandler}
      >
        <BsFillSkipBackwardFill />
      </Button>
      <QueueControlsPlayButton />
      <Button
        size="icon"
        variant="outline"
        disabled={isLastTrack}
        onClick={goForwardHandler}
      >
        <BsFillSkipForwardFill />
      </Button>
      <Button
        size="icon"
        variant={data?.queueList?.repeatQueue ? "secondary" : "outline"}
        onClick={repeatHandler}
      >
        {data?.queueList.repeatQueue === "PLAYLIST" ? (
          <MdOutlineRepeat size={20} />
        ) : data?.queueList.repeatQueue === "TRACK" ? (
          <MdOutlineRepeatOne size={20} />
        ) : (
          <MdOutlineRepeat size={20} />
        )}
      </Button>
    </div>
  );
}
