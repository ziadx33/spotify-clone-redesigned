"use client";

import { type User } from "@prisma/client";
import { Controls } from "./components/controls";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { TabsSection } from "./components/tabs";
import { AuthorContext } from "../contexts/author-context";
import { useQuery } from "@tanstack/react-query";
import { getPopularTracks } from "@/server/queries/track";

type ArtistProps = {
  artist: User;
  playlistId: string;
};

export function Artist({ artist, playlistId }: ArtistProps) {
  const { data } = useQuery({
    queryKey: [artist],
    queryFn: async () => {
      return await getPopularTracks({
        artistId: artist.id,
        range: { from: 0, to: 10 },
      });
    },
  });
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
        <div className="flex h-full w-full items-end justify-between max-lg:flex-col max-lg:items-start">
          <AuthorContext artist={artist} playlistId="artist-page">
            <div
              className={!artist.coverImage ? "flex items-center gap-3" : ""}
            >
              {!artist.coverImage && (
                <Image
                  src={artist.image ?? ""}
                  width={200}
                  height={200}
                  alt={artist.name ?? ""}
                  className="size-[200px] rounded-full"
                />
              )}
              <b className="text-8xl text-secondary-foreground max-lg:text-5xl">
                {artist.name}
              </b>
            </div>
          </AuthorContext>
          <Controls
            data={
              data?.tracks[0]?.id
                ? {
                    typeArtist: artist,
                    tracks: {
                      albums: data?.albums ?? [],
                      authors: data?.authors ?? [],
                      tracks: data?.tracks ?? [],
                    },
                    data: {
                      currentPlaying: data?.tracks[0]?.id,
                      trackList: data.tracks.map((track) => track.id),
                      type: "ARTIST",
                      typeId: artist.id,
                    },
                  }
                : undefined
            }
            playlistId={playlistId}
            artist={artist}
          />
        </div>
      </div>
      <div className="size-full py-5 lg:px-8">
        <TabsSection artist={artist} />
      </div>
    </div>
  );
}
