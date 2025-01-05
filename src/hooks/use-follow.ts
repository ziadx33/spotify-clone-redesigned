import { type User } from "@prisma/client";
import { useEffect, useRef, useState } from "react";
import { updateUserById } from "@/server/actions/user";
import { useDispatch } from "react-redux";
import { type AppDispatch } from "@/state/store";
import { followUser, unFollowUser } from "@/state/slices/following";
import { useUserData } from "./use-user-data";

type UseFollowParams = {
  artist?: User | null;
  playlistId: string;
};

export function useFollow({ artist, playlistId }: UseFollowParams) {
  const user = useUserData();
  const [isFollowed, setIsFollowed] = useState<boolean | null>(null);
  const followedSetDone = useRef(false);
  const [isFollowing, setIsFollowing] = useState(true);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (followedSetDone.current) return;
    if (!artist) return;
    if (!user?.id) return;
    setIsFollowed(artist?.followers?.includes(user?.id) ?? false);
    followedSetDone.current = true;
    setIsFollowing(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id, artist]);

  const reset = () => {
    setIsFollowed((v) => !v);
    setIsFollowing(false);
  };

  const follow = async (otherUser?: User | null) => {
    setIsFollowing(true);
    const artistData = artist ?? otherUser;
    if (artistData) dispatch(followUser(artistData));
    await updateUserById({
      id: artistData?.id ?? "",
      data: {
        followers: [...(artistData?.followers ?? []), user?.id ?? ""],
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        discoveredOn: [...(artistData?.discoveredOn ?? []), playlistId],
      },
    });
    reset();
  };

  const unfollow = async () => {
    setIsFollowing(true);
    dispatch(unFollowUser(artist?.id ?? ""));
    await updateUserById({
      id: artist?.id ?? "",
      data: {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
        followers: artist?.followers.filter(
          (follower) => follower !== user?.id,
        ),
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        discoveredOn:
          // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
          artist?.discoveredOn?.filter(
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
