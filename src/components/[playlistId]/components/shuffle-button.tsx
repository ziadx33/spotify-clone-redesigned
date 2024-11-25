import { Button } from "@/components/ui/button";
import { usePlayQueue } from "@/hooks/use-play-queue";
import { useQueue } from "@/hooks/use-queue";
import { type Playlist } from "@prisma/client";
import { FaShuffle } from "react-icons/fa6";

export function ShuffleButton({ playlist }: { playlist?: Playlist | null }) {
  const {
    data: { data },
    getQueue,
    editQueueListFn,
  } = useQueue();

  const { playHandler } = usePlayQueue({ playlist, noDefPlaylist: true });
  const currentQueue = getQueue(data?.queueList.currentQueueId);

  const shuffleHandler = async () => {
    if (!currentQueue) {
      return await playHandler(false, { randomize: true });
    } else if (data?.queueList) {
      return await editQueueListFn({
        queueListData: data.queueList,
        editData: { randomize: !data?.queueList.randomize },
      }).runBoth();
    }
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
