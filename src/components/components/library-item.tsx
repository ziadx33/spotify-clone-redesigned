import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { type User, type Playlist } from "@prisma/client";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { enumParser } from "@/utils/enum-parser";
import { HiMiniSpeakerWave } from "react-icons/hi2";
import Link from "next/link";
import { useState } from "react";
import { useTrackDropdownItems } from "@/hooks/use-track-dropdown-items";
import { toast } from "sonner";
import { usePrefrences } from "@/hooks/use-prefrences";
import { useDrop } from "@/hooks/use-drop";
import { getTrackById } from "@/server/queries/track";

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
  const isDroppable = !isArtist && data.creatorId === userData?.id;
  const getTrackItems = useTrackDropdownItems({ isFn: true });
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const { data: prefrences } = usePrefrences();

  const { ref } = useDrop<HTMLButtonElement>(
    "trackId",
    async (trackId) => {
      setIsDraggingOver(false);
      if (isArtist) return;
      const track = await getTrackById({ id: trackId });
      if (!track) return toast.error("Something went wrong");
      const { data: items } = getTrackItems(track);
      const event = items?.events.addToPlaylistHandler;
      event?.(data, track);
    },
    () => {
      setIsDraggingOver(true);
    },
    (e) => {
      if (!e.currentTarget.contains(e.relatedTarget as Node)) {
        setIsDraggingOver(false);
      }
    },
    isDroppable,
  );

  return (
    <Button
      variant="ghost"
      className={cn(
        "h-[4.3rem] w-full gap-3 border-2 border-transparent px-2 !no-underline",
        pathname.startsWith(
          isArtist ? `/artist/${data.id}` : `/playlist/${data.id}`,
        )
          ? "bg-muted"
          : "",
        isDraggingOver ? "border-2 border-primary" : "",
        !prefrences?.showSidebar ? "h-[4.3rem]" : "h-20",
      )}
      asChild
      ref={ref}
    >
      <Link
        href={
          type === "PLAYLIST"
            ? `/playlist/${data.id}`
            : `/artist/${data.id}?playlist=library`
        }
        className="flex w-full justify-start"
      >
        <div className="relative h-full w-[65px] overflow-hidden">
          <Image
            src={(isArtist ? data.image : data.imageSrc) ?? ""}
            className={cn("rounded-md", imageClassNames)}
            fill
            alt={isArtist ? data.name : data.title}
          />
        </div>
        {!prefrences?.showSidebar ? (
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
            {isActive && (
              <HiMiniSpeakerWave size={25} className="text-primary" />
            )}
          </div>
        ) : undefined}
      </Link>
    </Button>
  );
}
