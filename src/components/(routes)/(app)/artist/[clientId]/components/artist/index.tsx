import { type User } from "@prisma/client";
import { Controls } from "./components/controls";
import { PopularTracks } from "./components/popular-tracks";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { SavedTracks } from "./components/saved-tracks";
import { DiscographySection } from "./components/discography-section";
import { AppearsOnSection } from "./components/appears-on-section";
import { AboutSection } from "./components/about-section";

export function Artist({ artist }: { artist: User }) {
  return (
    <div className="flex min-h-full w-full flex-col">
      <div
        style={{
          background: `url(${artist.coverImage}) no-repeat`,
          backgroundSize: "cover",
          backgroundPosition: "top center",
        }}
        className={cn(
          "flex  w-full  border-b p-8",
          artist.coverImage ? "h-[30rem] items-end" : "h-72 items-center gap-8",
        )}
      >
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
      <div className="flex flex-col gap-12 p-8">
        <Controls artist={artist} />
        <div className="flex gap-8">
          <PopularTracks artist={artist} />
          <SavedTracks artist={artist} />
        </div>
        <DiscographySection artist={artist} />
        <AppearsOnSection artist={artist} />
        <AboutSection artist={artist} />
      </div>
    </div>
  );
}
