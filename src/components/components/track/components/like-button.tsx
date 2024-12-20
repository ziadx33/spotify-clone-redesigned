import { useUserData } from "@/hooks/use-user-data";
import { revalidate } from "@/server/actions/revalidate";
import { editTrackById } from "@/server/actions/track";
import { type Playlist, type Track } from "@prisma/client";
import { useRef, useState } from "react";
import { CiHeart } from "react-icons/ci";
import { FaHeart } from "react-icons/fa";

type LikeButtonProps = {
  track?: Track;
  playlist?: Playlist;
};

export function LikeButton({ track, playlist }: LikeButtonProps) {
  const user = useUserData();
  const [isLiked, setIsLiked] = useState(track?.likedUsers.includes(user.id));
  const editedTrack = useRef<Track | undefined>(track);
  const buttonHandler = async () => {
    if (!track?.id) return;
    setIsLiked((v) => !v);
    if (!isLiked)
      editedTrack.current = await editTrackById({
        id: track?.id,
        data: { likedUsers: [...(track?.likedUsers ?? []), user.id] },
      });
    else
      editedTrack.current = await editTrackById({
        id: track.id,
        data: {
          likedUsers: editedTrack.current?.likedUsers.filter(
            (id) => id !== user.id,
          ),
        },
      });

    void revalidate(`/playlist/${playlist?.id}`);
    void revalidate("/liked-songs");
  };
  return (
    <button
      onClick={buttonHandler}
      className="ml-4  opacity-0 transition-opacity group-hover:opacity-100"
    >
      {!isLiked ? (
        <CiHeart size={20} className="fill-primary text-primary" />
      ) : (
        <FaHeart size={18} className="fill-primary text-primary" />
      )}
    </button>
  );
}
