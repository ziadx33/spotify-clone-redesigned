import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { type User, type Playlist } from "@prisma/client";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Navigate } from "../navigate";

type PlaylistProps = { userData?: User; imageClassNames?: string } & (
  | { type: "ARTIST"; data: User }
  | { type: "PLAYLIST"; data: Playlist }
);

export function LibraryItem({
  type,
  data,
  userData,
  imageClassNames,
}: PlaylistProps) {
  const pathname = usePathname();
  const isArtist = type === "ARTIST";
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
      >
        <div className="relative h-full w-[65px] overflow-hidden">
          <Image
            src={(isArtist ? data.image : data.imageSrc) ?? ""}
            className={cn("rounded-md object-cover", imageClassNames)}
            fill
            alt={isArtist ? data.name : data.title}
          />
        </div>
        <h4 className="flex w-full flex-col items-start gap-1">
          <span>{isArtist ? data.name : data.title}</span>
          <span className="flex items-center gap-1.5 text-muted-foreground">
            {isArtist
              ? "Artist"
              : data.creatorId === userData?.id
                ? "Playlist"
                : "Album"}
          </span>
        </h4>
      </Navigate>
    </Button>
  );
}
