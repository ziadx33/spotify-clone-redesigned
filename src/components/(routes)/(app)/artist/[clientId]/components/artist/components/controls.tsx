"use client";

import { Button } from "@/components/ui/button";
import { useFollow } from "@/hooks/use-follow";
import { type User } from "@prisma/client";
import { BsThreeDots } from "react-icons/bs";
import { FaPlay } from "react-icons/fa";
import { FaShuffle } from "react-icons/fa6";

export function Controls({ artist }: { artist: User }) {
  const { isFollowed, toggle, isFollowing } = useFollow({ artist });
  console.log(isFollowed);
  return (
    <div className="flex h-fit w-full items-center">
      <Button size={"icon"} className="mr-4 h-16 w-16 rounded-full">
        <FaPlay size={20} />
      </Button>
      <Button size={"icon"} variant="ghost" className="h-16 w-16 rounded-full">
        <FaShuffle size={30} />
      </Button>
      <Button
        disabled={isFollowing}
        onClick={toggle}
        variant="outline"
        className="mx-2"
      >
        {isFollowed ? "Following" : "follow"}
      </Button>
      <Button size={"icon"} variant="ghost" className="h-16 w-16 rounded-full">
        <BsThreeDots size={32} />
      </Button>
    </div>
  );
}
