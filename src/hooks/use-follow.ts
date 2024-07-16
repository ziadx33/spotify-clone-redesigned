import { type User } from "@prisma/client";
import { useSession } from "./use-session";
import { useEffect, useRef, useState } from "react";
import { updateUserById } from "@/server/actions/user";
import { revalidate } from "@/server/actions/revalidate";
import { notFound, useSearchParams } from "next/navigation";

type UseFollowParams = {
  artist: User;
};

export function useFollow({ artist }: UseFollowParams) {
  const { data: user } = useSession();
  const playlist = useSearchParams().get("playlist");
  if (!playlist) notFound();
  const [isFollowed, setIsFollowed] = useState<boolean | null>(null);
  const followedSetDone = useRef(false);
  const [isFollowing, setIsFollowing] = useState(true);

  useEffect(() => {
    if (followedSetDone.current) return;
    if (!user?.user?.id) return;
    setIsFollowed(artist.followers.includes(user?.user?.id));
    followedSetDone.current = true;
    setIsFollowing(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.user?.id]);

  const reset = () => {
    revalidate(`/artist/${artist.id}`);
    setIsFollowed((v) => !v);
    setIsFollowing(false);
  };

  const follow = async () => {
    console.log("follow");
    setIsFollowing(true);
    await updateUserById({
      id: artist.id,
      data: {
        followers: [...artist.followers, user?.user?.id ?? ""],
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        discoveredOn: [...(artist.discoveredOn ?? []), playlist],
      },
    });
    reset();
  };

  const unfollow = async () => {
    console.log("unfollow");
    setIsFollowing(true);
    await updateUserById({
      id: artist.id,
      data: {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
        followers: artist.followers.filter(
          (follower) => follower !== user?.user?.id,
        ),
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        discoveredOn:
          // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
          artist.discoveredOn?.filter(
            (playlistId) => playlistId !== playlist,
          ) ?? [],
      },
    });
    reset();
  };

  const toggle = !isFollowed ? follow : unfollow;

  return {
    isFollowed,
    toggle,
    unfollow,
    follow,
    isFollowing,
  };
}
