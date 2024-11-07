import { FaPause, FaPlay } from "react-icons/fa";
import Image from "next/image";
import { type Playlist, type Track } from "@prisma/client";
import { QueuePlayButton } from "@/components/queue-play-button";

type PlayButtonProps = {
  showButtons: boolean;
  skeleton: boolean;
  trackIndex: number;
  queueTypeId?: string;
  playlist?: Playlist;
  track: Track;
};

export const PlayButton = ({
  showButtons,
  skeleton,
  track,
  playlist,
  queueTypeId,
  trackIndex,
}: PlayButtonProps) => {
  return (
    <QueuePlayButton
      queueTypeId={queueTypeId}
      isDiv
      className="cursor-pointer"
      disableButtonVariant
      skipToTrack={!skeleton ? track.id : undefined}
      playlist={!skeleton ? playlist : undefined}
      track={!skeleton ? track : undefined}
    >
      {(isPlaying, checkTrack) => {
        if (!isPlaying && !showButtons) return trackIndex + 1;
        if (isPlaying && !showButtons) {
          return (
            <Image
              src="/images/track-playing-image.svg"
              width={13}
              height={13}
              alt={""}
            />
          );
        }
        return !isPlaying || (!skeleton ? !checkTrack?.(track.id) : true) ? (
          <FaPlay size={10} />
        ) : (
          <FaPause size={10} />
        );
      }}
    </QueuePlayButton>
  );
};
