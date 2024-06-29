import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { type User, type Playlist } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

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
        "flex h-[4.3rem] justify-start gap-3 px-2",
        pathname.startsWith(`/playlist/${id}`) ? "bg-muted" : "",
      )}
      asChild
    >
      <Link href={`/playlist/${id}`}>
        <Image
          src={imageSrc}
          className="rounded-md"
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
      </Link>
    </Button>
  );
}
