"use client";

import { AuthorDropdown } from "@/components/dropdowns/author-dropdown";
import {
  QueuePlayButton,
  type QueuePlayButtonProps,
} from "@/components/queue-play-button";
import { Button } from "@/components/ui/button";
import { useFollow } from "@/hooks/use-follow";
import { useNavigate } from "@/hooks/use-navigate";
import { useQueue } from "@/hooks/use-queue";
import { useUserData } from "@/hooks/use-user-data";
import { type User } from "@prisma/client";
import { useMutation } from "@tanstack/react-query";
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
  const {
    addDataToQueue,
    data: { data: queueListData },
  } = useQueue();
  const artistHref = `/artist/${artist.id}?playlist=${playlistId}`;
  const user = useUserData();
  const navigate = useNavigate({
    href: artistHref,
    data: {
      title: artist.name,
      type: "ARTIST",
      href: artistHref,
      userId: user.id,
    },
  });
  const { status: addToQueueStatus, mutate: addToQueueHandler } = useMutation({
    mutationKey: ["add-artist-to-queue"],
    mutationFn: async () => {
      await addDataToQueue({
        data: artist,
        type: "ARTIST",
        queueList: queueListData?.queueList,
      });
    },
  });
  const { status: openNewTabStatus, mutate: openInNewTabHandler } = useMutation(
    {
      mutationKey: ["add-artist-in-new-tab"],
      mutationFn: async () => {
        if (!user?.id) return;
        navigate.apply({}, [, , false]);
      },
    },
  );

  return (
    <div className="flex h-fit w-fit items-center">
      <QueuePlayButton
        artist={artist}
        data={data}
        size={"icon"}
        className="group h-12 w-12 rounded-full"
      >
        {(isPlaying) =>
          !isPlaying ? <FaPlay size={15} /> : <FaPause size={15} />
        }
      </QueuePlayButton>
      <Button
        disabled={isFollowing}
        onClick={() => toggle()}
        variant="outline"
        className="mx-2 hover:backdrop-blur-2xl dark:bg-transparent dark:backdrop-blur-lg dark:transition-all dark:hover:bg-transparent"
      >
        {isFollowed ? "Following" : "follow"}
      </Button>
      <Button
        size={"icon"}
        disabled={openNewTabStatus === "pending"}
        onClick={() => openInNewTabHandler()}
        variant="ghost"
        className="group h-12 w-12 rounded-full"
      >
        <MdOutlineLibraryAdd
          size={20}
          className="text-white group-hover:text-black dark:text-secondary-foreground dark:group-hover:text-secondary-foreground"
        />
      </Button>
      <Button
        onClick={() => addToQueueHandler()}
        disabled={addToQueueStatus === "pending"}
        size={"icon"}
        variant="ghost"
        className="group h-12 w-12 rounded-full"
      >
        <MdFormatListBulletedAdd
          size={20}
          className="text-white group-hover:text-black dark:text-secondary-foreground dark:group-hover:text-secondary-foreground"
        />
      </Button>
      <AuthorDropdown artist={artist} playlistId={playlistId}>
        <Button
          size={"icon"}
          variant="ghost"
          className="group h-12 w-12 rounded-full"
        >
          <BsThreeDots
            size={20}
            className="text-white group-hover:text-black dark:text-secondary-foreground dark:group-hover:text-secondary-foreground"
          />
        </Button>
      </AuthorDropdown>
    </div>
  );
}
