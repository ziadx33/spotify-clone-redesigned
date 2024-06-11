import { Button } from "@/components/ui/button";
import { type Playlist } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";

export function Playlist({ title, imageSrc, id }: Playlist) {
  return (
    <Button
      variant="ghost"
      className="flex h-[4.3rem] justify-start gap-3 px-2"
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
          <span className="text-muted-foreground">0 tracks</span>
        </h4>
      </Link>
    </Button>
  );
}
