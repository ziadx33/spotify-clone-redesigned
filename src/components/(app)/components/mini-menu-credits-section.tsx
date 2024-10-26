import { Button } from "@/components/ui/button";
import { useFollow } from "@/hooks/use-follow";
import { useQueue } from "@/hooks/use-queue";
import { type User } from "@prisma/client";
import Link from "next/link";

export function MiniMenuCreditsSection() {
  const { getTrack, currentQueue } = useQueue();
  const currentData = getTrack(currentQueue?.queueData?.currentPlaying ?? "");
  return (
    <div className="mx-auto mt-3.5 flex w-[95%] flex-col gap-2 overflow-hidden rounded-lg bg-muted p-3 pt-3.5">
      <h3 className="mb-2 font-semibold">Credits</h3>
      {currentData.authors?.map((author) => {
        return (
          <ArtistItem
            {...author}
            key={author.id}
            desc={
              author.id === currentData.author?.id
                ? "Main Artist"
                : "Featured Artist"
            }
            playlistId={currentData.album?.id ?? ""}
            href={`/artist/${author.id}?playlist=${currentData.album?.id}`}
          />
        );
      })}
    </div>
  );
}

type ArtistItemProps = {
  href: string;
  desc: string;
  playlistId: string;
} & User;

function ArtistItem(data: ArtistItemProps) {
  const { toggle, isFollowing, isFollowed } = useFollow({
    artist: data,
    playlistId: data.playlistId,
  });
  return (
    <div className="flex justify-between">
      <div className="flex flex-col">
        <Link href={data.href}>{data.name}</Link>
        <p className="text-sm">{data.desc}</p>
      </div>
      <Button
        variant="ghost"
        className="border border-muted-foreground/30"
        disabled={isFollowing}
        onClick={() => toggle()}
      >
        {isFollowed ? "Unfollow" : "Follow"}
      </Button>
    </div>
  );
}
