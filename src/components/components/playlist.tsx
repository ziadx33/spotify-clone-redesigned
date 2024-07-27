import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { type User, type Playlist } from "@prisma/client";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Navigate } from "../navigate";

type PlaylistProps = {
  userData?: User;
} & Playlist;

export function Playlist({
  title,
  imageSrc,
  id,
  creatorId,
  userData,
}: PlaylistProps) {
  const pathname = usePathname();
  return (
    <Button
      variant="ghost"
      className={cn(
        "flex h-[4.3rem] justify-start gap-3 px-2 ",
        pathname.startsWith(`/playlist/${id}`) ? "bg-muted" : "",
      )}
      asChild
    >
      <Navigate
        data={{
          href: `/playlist/${id}`,
          title: title ?? "unknown",
          type: "PLAYLIST",
        }}
        href={`/playlist/${id}`}
      >
        <Image
          src={imageSrc}
          className="h-[55px] w-[70px] rounded-md object-cover"
          width={55}
          height={55}
          alt={title}
        />
        <h4 className="flex w-full flex-col items-start gap-1">
          <span>{title}</span>
          <span className="flex items-center gap-1.5 text-muted-foreground">
            {creatorId === userData?.id ? "Playlist" : "Album"}
          </span>
        </h4>
      </Navigate>
    </Button>
  );
}
