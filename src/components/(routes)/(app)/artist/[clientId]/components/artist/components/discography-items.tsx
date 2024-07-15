"use client";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { type User, type Playlist } from "@prisma/client";
import { SectionItem } from "../../../../../components/section-item";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { RenderCards } from "../../../../../components/render-cards";
import { useState, type ReactElement } from "react";
import { cn } from "@/lib/utils";

type DiscographyItemsProps = {
  albums: Playlist[];
  artist: User;
};

export function DiscographyItems({ albums, artist }: DiscographyItemsProps) {
  const itemsMapFn: (
    ...params: Parameters<Parameters<(typeof albums)["map"]>[0]>
  ) => ReactElement = (album) => {
    return (
      <SectionItem
        key={album.id}
        alt={album.title}
        showPlayButton
        title={album.title}
        image={album.imageSrc}
        description={`${format(new Date(album.createdAt), "yyy")} - ${album.type.toLowerCase()}`}
        link={`/playlist/${album.id}`}
      />
    );
  };
  const [showMoreButton, setShowMoreButton] = useState(false);
  return (
    <>
      <Button
        variant="link"
        className={cn(
          "mb-4 pl-0 text-3xl font-semibold text-white",
          showMoreButton
            ? "hover:underline"
            : " cursor-default hover:no-underline",
        )}
        asChild={showMoreButton}
      >
        {showMoreButton ? (
          <Link href={`/artist/${artist.id}/discography`}>Discography</Link>
        ) : (
          "Discography"
        )}
      </Button>
      <Tabs defaultValue="latest" className="w-full">
        <div className="flex items-center justify-between">
          <TabsList className="mb-4 grid w-[500px] grid-cols-3">
            <TabsTrigger value="latest">Latest Releases</TabsTrigger>
            <TabsTrigger value="albums">Albums</TabsTrigger>
            <TabsTrigger value="singles">Singles</TabsTrigger>
          </TabsList>
          {showMoreButton && (
            <Button variant="link" asChild>
              <Link href={`/artist/${artist.id}/discography`}>show more</Link>
            </Button>
          )}
        </div>
        <TabsContent value="latest" className="flex gap-2 overflow-x-hidden">
          <RenderCards cards={albums.map(itemsMapFn)} />
        </TabsContent>
        <TabsContent value="albums" className="flex gap-2 overflow-x-hidden">
          <RenderCards
            setShowMoreButton={setShowMoreButton}
            cards={albums
              .filter((album) => album.type === "ALBUM")
              .map(itemsMapFn)}
          />
        </TabsContent>
        <TabsContent value="singles" className="flex gap-2 overflow-x-hidden">
          <RenderCards cards={albums.map(itemsMapFn)} />
        </TabsContent>
      </Tabs>
    </>
  );
}
