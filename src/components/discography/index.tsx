"use client";

import { type User, type Playlist, type Track } from "@prisma/client";
import Link from "next/link";
import { Control } from "./components/control";
import { Albums } from "./components/albums";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useSearchParams } from "next/navigation";
import { Navigate } from "../navigate";

type DiscographyProps = {
  albums: Playlist[];
  artist: User;
  tracks: Track[];
};

export type FiltersStateType = {
  viewAs: "list" | "grid";
  filterBy: "all" | "albums" | "singles";
};

export function Discography({ albums, artist, tracks }: DiscographyProps) {
  const [filters, setFilters] = useState<FiltersStateType>({
    viewAs: "list",
    filterBy: "all",
  });
  const playlistId = useSearchParams().get("playlist");
  return (
    <div className="flex flex-col gap-12 p-6 pt-14">
      <section className="flex justify-between pt-8">
        <Navigate
          data={{
            href: `/artist/${artist.id}?playlist=${playlistId}`,
            title: artist.name ?? "unknown",
            type: "ARTIST",
          }}
          href={`/artist/${artist.id}?playlist=${playlistId}`}
          className="text-3xl font-bold hover:underline"
        >
          {artist.name}
        </Navigate>
        <Control setFilters={setFilters} filters={filters} />
      </section>
      <div
        className={cn(
          "flex",
          filters.viewAs === "list" ? "flex-col gap-20" : "flex-row",
        )}
      >
        <Albums
          filters={filters}
          artist={artist}
          albums={albums}
          tracks={tracks}
        />
      </div>
    </div>
  );
}
