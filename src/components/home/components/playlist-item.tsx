import { Button } from "@/components/ui/button";
import { type Playlist } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import { FaPlay } from "react-icons/fa";

export function PlaylistItem({ data }: { data: Playlist }) {
  return (
    <Link
      href={`/playlist/${data.id}`}
      className="group relative flex h-12 w-[320px] min-w-[300px] max-w-[600px] gap-2 overflow-hidden rounded-sm bg-secondary/70 transition-colors hover:bg-secondary hover:no-underline"
    >
      <div className="relative h-full w-14">
        <Image src={data.imageSrc} fill alt={data.title} />
      </div>
      <div className="flex h-full w-full items-center justify-between pr-2">
        <h3 className="text-sm font-bold">{data.title}</h3>
        <Button
          size="icon"
          className="size-8 rounded-full opacity-0 transition-opacity duration-300 ease-out group-hover:opacity-100 group-hover:duration-100"
        >
          <FaPlay size={12} />
        </Button>
      </div>
    </Link>
  );
}
