import { Button } from "@/components/ui/button";
import { useGetPlayData } from "@/hooks/use-get-play-data";
import { useQueue } from "@/hooks/use-queue";
import { type Playlist } from "@prisma/client";
import { FaShuffle } from "react-icons/fa6";

export function ShuffleButton({ playlist }: { playlist?: Playlist | null }) {
  const {
    data: { data, error },
    play,
    shuffleQueue,
  } = useQueue();
  const { getData } = useGetPlayData({ playlist });
  const shuffleHandler = async () => {
    const data = await getData();
    if (error) return await play(data.data!, { randomize: true });
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
