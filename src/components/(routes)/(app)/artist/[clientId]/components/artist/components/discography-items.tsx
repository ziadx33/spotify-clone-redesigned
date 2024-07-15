import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { type User, type Playlist } from "@prisma/client";
import { SectionItem } from "../../../../../components/section-item";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { RenderCards } from "../../../../../components/render-cards";
import { type ReactElement } from "react";

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
  return (
    <Tabs defaultValue="latest" className="w-full">
      <div className="flex items-center justify-between">
        <TabsList className="mb-4 grid w-[500px] grid-cols-3">
          <TabsTrigger value="latest">Latest Releases</TabsTrigger>
          <TabsTrigger value="albums">Albums</TabsTrigger>
          <TabsTrigger value="singles">Singles</TabsTrigger>
        </TabsList>
        <Button variant="link" asChild>
          <Link href={`/artist/${artist.id}/discography`}>show more</Link>
        </Button>
      </div>
      <TabsContent value="latest" className="flex gap-2 overflow-x-hidden">
        <RenderCards cards={albums.map(itemsMapFn)} />
      </TabsContent>
      <TabsContent value="albums" className="flex gap-2 overflow-x-hidden">
        <RenderCards
          cards={albums
            .filter((album) => album.type === "ALBUM")
            .map(itemsMapFn)}
        />
      </TabsContent>
      <TabsContent value="singles" className="flex gap-2 overflow-x-hidden">
        <RenderCards cards={albums.map(itemsMapFn)} />
      </TabsContent>
    </Tabs>
  );
}
