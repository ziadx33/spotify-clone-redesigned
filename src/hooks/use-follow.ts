import { type User } from "@prisma/client";
import { useSession } from "./use-session";
import { useEffect, useRef, useState } from "react";
import { updateUserById } from "@/server/actions/user";
import { revalidate } from "@/server/actions/revalidate";

type UseFollowParams = {
  artist: User;
  playlistId: string;
};

export function useFollow({ artist, playlistId }: UseFollowParams) {
  const { data: user } = useSession();
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
    setIsFollowing(true);
    await updateUserById({
      id: artist.id,
      data: {
        followers: [...artist.followers, user?.user?.id ?? ""],
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        discoveredOn: [...(artist.discoveredOn ?? []), playlistId],
      },
    });
    reset();
  };

  const unfollow = async () => {
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
            (playlistId) => playlistId !== playlistId,
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
