import { LikeButton } from "@/components/components/track/components/like-button";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { useQueue } from "@/hooks/use-queue";
import Image from "next/image";
import Link from "next/link";
import { LuClipboardCopy } from "react-icons/lu";
import { RiAlbumLine } from "react-icons/ri";
import { QueueProgressBar } from "./queue-progress-bar";
import { HiOutlineQueueList } from "react-icons/hi2";
import { QueueMenu } from "./queue-menu";
import { BsThreeDots } from "react-icons/bs";
import { TrackMoreButton } from "@/components/components/track-more-button";

export function MobileTrackMenu() {
  const {
    getTrack,
    getQueue,
    data: { data: queueListData },
  } = useQueue();
  const currentQueue = getQueue(queueListData?.queueList.currentQueueId);

  const currentData = getTrack(currentQueue?.queueData?.currentPlaying ?? "");
  const albumLink = `/playlist/${currentData.album?.id}`;
  const artistLink = `/artist/${currentData.author?.id}?playlist=${currentData.album?.id}`;
  return (
    <DrawerContent className="h-full" forceMount>
      <div className="flex flex-col items-center gap-6 px-5 pt-6">
        <Link href={albumLink} className=" flex items-center gap-2">
          <RiAlbumLine /> {currentData.album?.title}
        </Link>
        <Link
          href={albumLink}
          className="relative h-fit min-h-96 w-full overflow-hidden rounded-lg"
        >
          <Image
            src={currentData.track?.imgSrc ?? ""}
            alt={currentData.track?.title ?? ""}
            fill
          />
        </Link>
        <div className="flex w-full justify-between">
          <div className="flex flex-col">
            <h1 className="text-2xl font-semibold">
              {currentData.track?.title}
            </h1>
            <Link href={artistLink} className="text-muted-foreground">
              {currentData.author?.name}
            </Link>
          </div>
          <div className="flex gap-2">
            <LikeButton
              customButton={(children, handler) => (
                <Button onClick={handler} variant="ghost" size="icon">
                  {children}
                </Button>
              )}
              heartClasses="text-3xl"
              track={currentData.track}
              playlist={currentData.album}
              heartsSize={30}
            />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigator.clipboard.writeText(albumLink)}
            >
              <LuClipboardCopy size={20} />
            </Button>
          </div>
        </div>
        <div className="mt-6 flex w-full flex-col-reverse">
          <QueueProgressBar
            handleQueueControls={(children) => (
              <div className="mt-6 flex justify-center">{children}</div>
            )}
            duration={currentData?.track?.duration}
          />
        </div>
      </div>
      <div className="mb-14 mt-auto flex justify-between gap-2 px-8">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigator.clipboard.writeText(albumLink)}
        >
          <LuClipboardCopy size={20} />
        </Button>
        <Drawer>
          <DrawerTrigger asChild>
            <Button variant="ghost" size="icon">
              <HiOutlineQueueList size={20} />
            </Button>
          </DrawerTrigger>
          <DrawerContent className="h-full">
            <QueueMenu />
          </DrawerContent>
        </Drawer>
        <TrackMoreButton
          track={currentData.track}
          playlist={currentData.album}
          trigger={
            <Button variant="ghost" size="icon">
              <BsThreeDots size={20} />
            </Button>
          }
        />
      </div>
    </DrawerContent>
  );
}
