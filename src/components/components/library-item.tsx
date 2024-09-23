import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { type User, type Playlist } from "@prisma/client";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Navigate } from "../navigate";
import { enumParser } from "@/utils/enum-parser";
import { PiQueueBold } from "react-icons/pi";
import { useQueue } from "@/hooks/use-queue";
import { FaSpeakerDeck } from "react-icons/fa";
import { HiMiniSpeakerWave } from "react-icons/hi2";

type PlaylistProps = {
  userData?: User;
  imageClassNames?: string;
  isActive: boolean;
} & ({ type: "ARTIST"; data: User } | { type: "PLAYLIST"; data: Playlist });

export function LibraryItem({
  type,
  data,
  userData,
  imageClassNames,
  isActive,
}: PlaylistProps) {
  const pathname = usePathname();
  const isArtist = type === "ARTIST";
  const {
    addPlaylistToQueue,
    data: { data: queueData },
  } = useQueue();
  const addToQueueObj = {
    icon: <PiQueueBold />,
    title: "Add to queue",
    onClick: () =>
      void addPlaylistToQueue(
        isArtist
          ? {
              data,
              type,
              queueList: queueData?.queueList,
            }
          : {
              data,
              type,
              queueList: queueData?.queueList,
            },
      ),
  };
  return (
    <Button
      variant="ghost"
      className={cn(
        "h-[4.3rem] gap-3 px-2 ",
        pathname.startsWith(
          isArtist ? `/artist/${data.id}` : `/playlist/${data.id}`,
        )
          ? "bg-muted"
          : "",
      )}
      asChild
    >
      <Navigate
        data={{
          href: isArtist
            ? `/artist/${data.id}?playlist=library`
            : `/playlist/${data.id}`,
          title: isArtist ? data.name : data.title ?? "unknown",
          type: "ARTIST",
        }}
        href={
          isArtist
            ? `/artist/${data.id}?playlist=library`
            : `/playlist/${data.id}`
        }
        contextItems={[addToQueueObj]}
      >
        <div className="relative h-full w-[65px] overflow-hidden">
          <Image
            src={(isArtist ? data.image : data.imageSrc) ?? ""}
            className={cn("rounded-md", imageClassNames)}
            fill
            alt={isArtist ? data.name : data.title}
          />
        </div>
        <div className="flex size-full items-center justify-between pr-3">
          <h4 className="flex w-full flex-col items-start gap-1">
            <span className={isActive ? "text-primary" : ""}>
              {isArtist ? data.name : data.title}
            </span>
            <span className="flex items-center gap-1.5 capitalize text-muted-foreground">
              {isArtist
                ? "artist"
                : data.creatorId === userData?.id
                  ? "playlist"
                  : enumParser(data.type)}
            </span>
          </h4>
          {isActive && <HiMiniSpeakerWave size={25} className="text-primary" />}
        </div>
      </Navigate>
    </Button>
  );
}
