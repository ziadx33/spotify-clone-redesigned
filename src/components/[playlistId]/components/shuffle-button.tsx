import { type QueuePlayButtonProps } from "@/components/queue-play-button";
import { Button } from "@/components/ui/button";
import { useQueue } from "@/hooks/use-queue";
import { FaShuffle } from "react-icons/fa6";

export function ShuffleButton({
  queueData,
}: {
  queueData: QueuePlayButtonProps["data"];
}) {
  const {
    data: { data, error },
    play,
    shuffleQueue,
  } = useQueue();
  const shuffleHandler = async () => {
    if (!queueData) return;
    if (error) return await play(queueData, { randomize: true });
    await shuffleQueue({ value: (v) => !v });
  };
  return (
    <Button
      size={"icon"}
      variant={!data?.queueList.randomize ? "ghost" : "secondary"}
      className="size-12 rounded-full"
      onClick={shuffleHandler}
    >
      <FaShuffle size={22} />
    </Button>
  );
}
