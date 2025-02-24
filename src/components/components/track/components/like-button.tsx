import { useUserData } from "@/hooks/use-user-data";
import { editTrackById } from "@/server/actions/track";
import { type Playlist, type Track } from "@prisma/client";
import { type ReactNode, useRef, useState } from "react";
import { CiHeart } from "react-icons/ci";
import { FaHeart } from "react-icons/fa";

type LikeButtonProps = {
  track?: Track | null;
  playlist?: Playlist | null;
  customButton?: (
    children: ReactNode,
    handler: () => Promise<void>,
  ) => React.ReactNode;
  heartClasses?: string;
  heartsSize?: number;
};

export function LikeButton({
  track,
  playlist,
  customButton,
  heartClasses,
  heartsSize = 20,
}: LikeButtonProps) {
  const user = useUserData();
  const [isLiked, setIsLiked] = useState(track?.likedUsers.includes(user.id));
  const editedTrack = useRef<Track | undefined | null>(track);
  const buttonHandler = async () => {
    if (!track?.id) return;
    setIsLiked((v) => !v);
    if (!isLiked)
      editedTrack.current = await editTrackById({
        id: track?.id,
        data: { likedUsers: [...(track?.likedUsers ?? []), user.id] },
        playlistId: playlist?.id,
      });
    else
      editedTrack.current = await editTrackById({
        id: track.id,
        data: {
          likedUsers: editedTrack.current?.likedUsers.filter(
            (id) => id !== user.id,
          ),
        },
        playlistId: playlist?.id,
      });
  };
  const children = !isLiked ? (
    <CiHeart
      size={heartsSize}
      className={heartClasses ?? "fill-primary text-primary"}
    />
  ) : (
    <FaHeart
      size={heartsSize - 2}
      className={heartClasses ?? "fill-primary text-primary"}
    />
  );
  return !customButton ? (
    <button
      onClick={buttonHandler}
      className="ml-4  opacity-0 transition-opacity group-hover:opacity-100"
    >
      {children}
    </button>
  ) : (
    customButton(children, buttonHandler)
  );
}
