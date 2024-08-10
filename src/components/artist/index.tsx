import { type User } from "@prisma/client";
import { Controls } from "./components/controls";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { TabsSection } from "./components/tabs";

type ArtistProps = {
  artist: User;
  playlistId: string;
};

export async function Artist({ artist, playlistId }: ArtistProps) {
  return (
    <div className="flex min-h-full w-full flex-col">
      <div
        style={{
          background: `url(${artist.coverImage}) no-repeat`,
          backgroundSize: "cover",
          backgroundPosition: "top center",
        }}
        className={cn(
          "flex w-full border-b p-8",
          artist.coverImage ? "h-[30rem] items-end" : "h-72 items-center gap-8",
        )}
      >
        <div className="flex h-full w-full items-end justify-between">
          <div className={!artist.coverImage ? "flex items-center gap-3" : ""}>
            {!artist.coverImage && (
              <Image
                src={artist.image ?? ""}
                width={200}
                height={200}
                alt={artist.name ?? ""}
                className="size-[200px] rounded-full object-cover"
              />
            )}
            <b className="text-8xl">{artist.name}</b>
          </div>
          <Controls playlistId={playlistId} artist={artist} />
        </div>
      </div>
      <div className="size-full px-8 py-5">
        <TabsSection playlistId={playlistId} artist={artist} />
      </div>
    </div>
  );
}
