"use client";

import {
  QueuePlayButton,
  type QueuePlayButtonProps,
} from "@/components/queue-play-button";
import { Button } from "@/components/ui/button";
import { useFollow } from "@/hooks/use-follow";
import { type User } from "@prisma/client";
import { BsThreeDots } from "react-icons/bs";
import { FaPause, FaPlay } from "react-icons/fa";
import { MdFormatListBulletedAdd, MdOutlineLibraryAdd } from "react-icons/md";

type ControlsProps = {
  artist: User;
  playlistId: string;
  data?: QueuePlayButtonProps["data"];
};

export function Controls({ artist, playlistId, data }: ControlsProps) {
  const { isFollowed, toggle, isFollowing } = useFollow({ artist, playlistId });
  return (
    <div className="flex h-fit w-fit items-center">
      <QueuePlayButton
        artist={artist}
        data={data}
        size={"icon"}
        className="h-12 w-12 rounded-full"
      >
        {(isPlaying) =>
          !isPlaying ? <FaPlay size={15} /> : <FaPause size={15} />
        }
      </QueuePlayButton>
      <Button
        disabled={isFollowing}
        onClick={toggle}
        variant="outline"
        className="mx-2 bg-transparent backdrop-blur-lg transition-all hover:bg-transparent hover:backdrop-blur-2xl"
      >
        {isFollowed ? "Following" : "follow"}
      </Button>
      <Button size={"icon"} variant="ghost" className="h-12 w-12 rounded-full">
        <MdOutlineLibraryAdd size={20} />
      </Button>
      <Button size={"icon"} variant="ghost" className="h-12 w-12 rounded-full">
        <MdFormatListBulletedAdd size={20} />
      </Button>
      <Button size={"icon"} variant="ghost" className="h-12 w-12 rounded-full">
        <BsThreeDots size={20} />
      </Button>
    </div>
  );
}
