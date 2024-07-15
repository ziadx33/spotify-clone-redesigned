import { type User } from "@prisma/client";
import { useSession } from "./use-session";
import { useState } from "react";
import { updateUserById } from "@/server/actions/user";
import { revalidate } from "@/server/actions/revalidate";

type UseFollowParams = {
  artist: User;
};

export function useFollow({ artist }: UseFollowParams) {
  const { data: user } = useSession();
  const [isFollowed, setIsFollowed] = useState(
    !artist.followers.includes(user?.user?.id ?? ""),
  );
  console.log("followed?", isFollowed);
  const [isFollowing, setIsFollowing] = useState(false);

  console.log(artist.followers);

  const follow = async () => {
    console.log("follow");
    setIsFollowing(true);
    await updateUserById({
      id: artist.id,
      data: {
        followers: [...artist.followers, user?.user?.id ?? ""],
      },
    });
    revalidate(`/artist/${artist.id}`);
    setIsFollowed((v) => !v);
    setIsFollowing(false);
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
      },
    });
    revalidate(`/artist/${artist.id}`);
    setIsFollowed((v) => !v);
    setIsFollowing(false);
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
