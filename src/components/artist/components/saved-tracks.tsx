import { Navigate } from "@/components/navigate";
import { type getSavedTracks } from "@/server/actions/track";
import { type User } from "@prisma/client";
import Image from "next/image";
import React from "react";
import { FaHeart } from "react-icons/fa";

type SavedTracksProps = {
  artist: User;
  data: Awaited<ReturnType<typeof getSavedTracks>>;
};

export async function SavedTracks({
  artist,
  data: savedTracks,
}: SavedTracksProps) {
  return (
    <div className="w-[80%] flex-col">
      <h1 className="mb-4 text-3xl font-semibold">Saved Tracks</h1>
      <div className="flex items-center gap-2.5">
        <div className="relative size-[100px]">
          <Image
            src={artist.image ?? ""}
            fill
            alt={artist.name ?? ""}
            className="size-[100px] rounded-full"
          />
          <div className="absolute bottom-1 right-1 rounded-full bg-primary p-1.5">
            <FaHeart className="fill-white" size={15} />
          </div>
        </div>
        <div className="flex flex-col">
          <Navigate
            data={{
              href: `/artist/${artist.id}/saved-tracks`,
              title: `Saved Tracks - ${artist.name}` ?? "unknown",
              type: "ARTIST",
            }}
            href={`/artist/${artist.id}/saved-tracks`}
            className="text-xl font-semibold hover:underline"
          >
            You&apos;ve Saved {savedTracks.data?.tracks?.length} tracks
          </Navigate>
          <p className="text-sm text-muted-foreground">by {artist.name}</p>
        </div>
      </div>
    </div>
  );
}
