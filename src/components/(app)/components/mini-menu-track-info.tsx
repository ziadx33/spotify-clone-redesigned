import { AvatarData } from "@/components/avatar-data";
import {
  TrackMoreButton,
  AddToPlaylist,
} from "@/components/components/track-more-button";
import { useMiniMenu } from "@/hooks/use-mini-menu";
import { useQueue } from "@/hooks/use-queue";
import Link from "next/link";
import { FaX } from "react-icons/fa6";
import { LuClipboardCopy } from "react-icons/lu";
import { RiPlayListAddLine } from "react-icons/ri";

export function MiniMenuTrackInfo() {
  const { getTrack, currentQueue } = useQueue();
  const currentData = getTrack(currentQueue?.queueData?.currentPlaying ?? "");
  const { setShowMenu } = useMiniMenu();
  return (
    <div className="p-4 pb-2.5 pt-4">
      <div className="mb-4 flex justify-between ">
        <Link
          className="text-lg font-bold"
          href={`/${currentQueue?.queueData?.type === "PLAYLIST" ? "playlist" : "artist"}/${currentQueue?.artistTypeData?.id ?? currentQueue?.playlistTypeData?.id}${currentQueue?.queueData?.type === "ARTIST" ? `?playlist=${currentQueue.queueData.currentPlaying}` : ""}`}
        >
          {currentQueue?.playlistTypeData?.title ??
            currentQueue?.artistTypeData?.name}
        </Link>
        <div className="flex items-center gap-4">
          <TrackMoreButton
            playlist={currentData.album}
            track={currentData.track}
          />
          <button onClick={() => setShowMenu(false, false)}>
            <FaX />
          </button>
        </div>
      </div>
      <Link href={`/playlist/${currentData.album?.id}`} className="size-fit">
        <AvatarData
          src={currentData.track?.imgSrc}
          containerClasses="rounded-lg w-full h-fit mb-4"
        />
      </Link>
      <div className="mb-4 flex justify-between">
        <div className="flex flex-col">
          <Link
            href={`/playlist/${currentData.album?.id}`}
            className="text-2xl font-bold"
          >
            {currentData.track?.title}
          </Link>
          <Link
            href={`/artist/${currentData.author?.id}?playlist=${currentData.album?.id}`}
            className="text-md text-muted-foreground"
          >
            {currentData.author?.name}
          </Link>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() =>
              navigator.clipboard.writeText(
                `${location.origin}/playlist/${currentData.album?.id}`,
              )
            }
          >
            <LuClipboardCopy />
          </button>
          <AddToPlaylist
            trigger={
              <button>
                <RiPlayListAddLine />
              </button>
            }
            track={currentData.track ?? null}
          />
        </div>
      </div>
    </div>
  );
}
