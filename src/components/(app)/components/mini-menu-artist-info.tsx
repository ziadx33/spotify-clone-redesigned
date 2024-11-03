import { AvatarData } from "@/components/avatar-data";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { useFollow } from "@/hooks/use-follow";
import { useQueue } from "@/hooks/use-queue";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

export function MiniMenuArtistInfo() {
  const {
    getTrack,
    getQueue,
    data: { data: queueListData },
  } = useQueue();
  const currentQueue = getQueue(queueListData?.queueList.currentQueueId);
  const currentData = getTrack(currentQueue?.queueData?.currentPlaying ?? "");
  const { toggle, isFollowed, isFollowing } = useFollow({
    artist: currentData.author!,
    playlistId: currentData.album?.id ?? "",
  });

  const isDialog = (currentData.author?.about?.trim()?.length ?? 0) !== 0;

  const triggerContent = (
    <div className="relative mx-auto flex w-[95%] flex-col gap-2 overflow-hidden rounded-lg bg-muted">
      <h3
        className={cn(
          "z-10 mb-2 p-3 pt-3.5 font-semibold",
          currentData.author?.aboutImage ? "absolute" : "",
        )}
      >
        About the artist
      </h3>
      {currentData.author?.aboutImage ? (
        <div className="h-64 w-full">
          <AvatarData
            src={currentData.author?.aboutImage ?? undefined}
            containerClasses="size-full rounded-none"
          />
        </div>
      ) : (
        <div className="pl-3">
          <AvatarData
            src={currentData.author?.image ?? undefined}
            containerClasses="w-16 h-fit"
          />
        </div>
      )}
      <div className="p-3 pt-1">
        <Link
          href={`/artist/${currentData.author?.id}?playlist=${currentData.album?.id}`}
          className="text-lg font-semibold"
        >
          {currentData.author?.name}
        </Link>
        <div className="mb-2 mt-1.5 flex items-center justify-between">
          <h4 className="text-md text-muted-foreground">
            {(currentData.author?.followers.length ?? 0) - (isFollowed ? 0 : 1)}{" "}
            followers
          </h4>
          <Button
            onClick={() => toggle()}
            variant="ghost"
            size="sm"
            disabled={isFollowing}
            className="border border-muted-foreground/30"
          >
            {isFollowed ? "Unfollow" : "Follow"}
          </Button>
        </div>
        <p className="line-clamp-3 text-sm text-muted-foreground">
          {currentData.author?.about}
        </p>
      </div>
    </div>
  );

  const dialogContent = (
    <DialogContent className="flex h-[694.391px] w-full max-w-[768px] flex-col overflow-y-scroll">
      {currentData.author?.aboutImage && (
        <Image
          src={currentData.author?.aboutImage ?? ""}
          width={320}
          height={200}
          alt={currentData.author?.name ?? ""}
          className="mx-auto"
        />
      )}
      <div className="p-4">
        <div className="flex items-start gap-4">
          <div className="flex flex-col">
            <h2 className="text-3xl font-bold">
              {new Intl.NumberFormat("en-US").format(
                currentData.author?.followers.length ?? 0,
              )}
            </h2>
            <p className="text-sm text-muted-foreground">Followers</p>
          </div>
          <p className="ml-4 text-muted-foreground">
            {currentData.author?.about}
          </p>
        </div>
      </div>
    </DialogContent>
  );

  return isDialog ? (
    <Dialog>
      <DialogTrigger asChild className="cursor-pointer">
        {triggerContent}
      </DialogTrigger>
      {dialogContent}
    </Dialog>
  ) : (
    triggerContent
  );
}
