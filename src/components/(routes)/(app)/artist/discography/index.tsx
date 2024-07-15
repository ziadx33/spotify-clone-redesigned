"use client";

import { type User, type Playlist, type Track } from "@prisma/client";
import Link from "next/link";
import { Control } from "./components/control";
import { Albums } from "./components/albums";
import { useState } from "react";
import { cn } from "@/lib/utils";

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
  return (
    <div className="flex flex-col gap-12 p-6 pt-8">
      <section className="flex justify-between pt-8">
        <Link
          href={`/artist/${artist.id}`}
          className="text-3xl font-bold hover:underline"
        >
          {artist.name}
        </Link>
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
