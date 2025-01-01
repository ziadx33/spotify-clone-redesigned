import { AvatarData } from "@/components/avatar-data";
import { TrackMoreButton } from "@/components/components/track-more-button";
import { AuthorContext } from "@/components/contexts/author-context";
import { PlaylistContext } from "@/components/contexts/playlist-context";
import { TrackContext } from "@/components/contexts/track-context";
import { useMiniMenu } from "@/hooks/use-mini-menu";
import { useQueue } from "@/hooks/use-queue";
import Link from "next/link";
import { FaX } from "react-icons/fa6";
import { LuClipboardCopy } from "react-icons/lu";

export function MiniMenuTrackInfo() {
  const {
    getTrack,
    getQueue,
    data: { data: queueListData, status },
  } = useQueue();
  const currentQueue = getQueue(queueListData?.queueList.currentQueueId);
  const currentData = getTrack(currentQueue?.queueData?.currentPlaying ?? "");
  const { setShowMenu } = useMiniMenu();
  const isDraggable = status === "success";

  return (
    <div className="w-full p-4 pb-2.5 pt-4">
      <div className="mb-4 flex w-full justify-between">
        <PlaylistContext playlist={currentData.album}>
          <Link
            className="text-lg font-bold"
            href={`/${currentQueue?.queueData?.type === "PLAYLIST" ? "playlist" : "artist"}/${currentQueue?.artistTypeData?.id ?? currentQueue?.playlistTypeData?.id}${currentQueue?.queueData?.type === "ARTIST" ? `?playlist=${currentQueue.queueData.currentPlaying}` : ""}`}
          >
            {currentQueue?.playlistTypeData?.title ??
              currentQueue?.artistTypeData?.name}
          </Link>
        </PlaylistContext>
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
      <TrackContext
        playlist={currentData.album}
        track={currentData.track}
        dragController={isDraggable}
      >
        <Link href={`/playlist/${currentData.album?.id}`} className="size-fit">
          <AvatarData
            src={currentData.track?.imgSrc}
            containerClasses="rounded-lg w-full h-fit mb-4"
          />
        </Link>
      </TrackContext>
      <div className="mb-4 flex justify-between">
        <div className="flex flex-col">
          <TrackContext
            playlist={currentData.album}
            track={currentData.track}
            dragController={isDraggable}
          >
            <Link
              href={`/playlist/${currentData.album?.id}`}
              className="text-2xl font-bold"
            >
              {currentData.track?.title}
            </Link>
          </TrackContext>
          <AuthorContext
            dragController={isDraggable}
            artist={currentData.author}
            playlistId={currentData.album?.id ?? "playing-album"}
          >
            <Link
              href={`/artist/${currentData.author?.id}?playlist=${currentData.album?.id}`}
              className="text-md bg-transparent text-muted-foreground"
            >
              {currentData.author?.name}
            </Link>
          </AuthorContext>
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
        </div>
      </div>
    </div>
  );
}
