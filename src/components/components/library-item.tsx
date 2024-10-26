import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { type User, type Playlist } from "@prisma/client";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { enumParser } from "@/utils/enum-parser";
import { HiMiniSpeakerWave } from "react-icons/hi2";
import Link from "next/link";
import { useState, type DragEvent } from "react";
import { useTrackDropdownItems } from "@/hooks/use-track-dropdown-items";
import { useTracks } from "@/hooks/use-tracks";
import { toast } from "sonner";

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
  const { data: tracks } = useTracks();
  const [isDraggingOver, setIsDraggingOver] = useState(false);

  const handleDrop = (e: DragEvent<HTMLButtonElement>) => {
    setIsDraggingOver(false);
    if (isArtist) return;
    const trackId = e.dataTransfer.getData("trackId");
    if (trackId) {
      const track = tracks?.tracks?.find((track) => track.id === trackId);
      if (!track) return toast.error("something went wrong");
      const { data: items } = getTrackItems(track);
      const event = items?.events.addToPlaylistHandler;
      void event?.(data, track);
    }
  };

  const handleDragEnter = () => {
    setIsDraggingOver(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLButtonElement>) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setIsDraggingOver(false);
    }
  };

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
      )}
      asChild
      onDrop={isDroppable ? handleDrop : undefined}
      onDragOver={(e) => e.preventDefault()}
      onDragEnter={isDroppable ? handleDragEnter : undefined}
      onDragLeave={isDroppable ? handleDragLeave : undefined}
    >
      <Link
        href={
          type === "PLAYLIST"
            ? `/playlist/${data.id}`
            : `/artist/${data.id}?playlist=library`
        }
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
      </Link>
    </Button>
  );
}
