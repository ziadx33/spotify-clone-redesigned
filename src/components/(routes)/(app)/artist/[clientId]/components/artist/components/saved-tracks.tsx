import { getSavedTracks } from "@/server/actions/track";
import { getServerAuthSession } from "@/server/auth";
import { type User } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { FaHeart } from "react-icons/fa";

export async function SavedTracks({ artist }: { artist: User }) {
  const user = await getServerAuthSession();
  const savedTracks = await getSavedTracks({
    artistId: artist.id,
    playlists: user?.user.playlists ?? [],
  });
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
          <Link
            href={`/artist/${artist.id}/liked-tracks`}
            className="text-xl font-semibold hover:underline"
          >
            You&apos;ve Saved {savedTracks.length} tracks
          </Link>
          <p className="text-sm text-muted-foreground">by {artist.name}</p>
        </div>
      </div>
    </div>
  );
}
