import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { type Playlist } from "@prisma/client";
import { SectionItem } from "./section-item";
import { format } from "date-fns";

export function DiscographyItems({ albums }: { albums: Playlist[] }) {
  const itemsMapFn = (
    album: Playlist,
    albumIndex: number,
    currentValue: string,
  ) => {
    return (
      <SectionItem
        key={album.id}
        alt={album.title}
        showPlayButton
        title={album.title}
        image={album.imageSrc}
        description={`${albumIndex === 0 && currentValue === "latest" ? "latest release" : format(new Date(album.createdAt), "YYY")} - ${album.type.toLowerCase()}`}
        link={`/playlist/${album.id}`}
      />
    );
  };
  return (
    <Tabs defaultValue="latest" className="w-full">
      <TabsList className="mb-4 grid w-[500px] grid-cols-3">
        <TabsTrigger value="latest">Latest Releases</TabsTrigger>
        <TabsTrigger value="albums">Albums</TabsTrigger>
        <TabsTrigger value="singles">Singles</TabsTrigger>
      </TabsList>
      <TabsContent value="latest" className="flex gap-2">
        {albums
          .sort((a, b) => {
            return (
              new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
            );
          })
          .map((v, vIndex) => itemsMapFn(v, vIndex, "latest"))}
      </TabsContent>
      <TabsContent value="albums" className="flex gap-2">
        {albums
          .filter((album) => album.type === "ALBUM")
          .map((v, vIndex) => itemsMapFn(v, vIndex, "albums"))}
      </TabsContent>
      <TabsContent value="singles" className="flex gap-2">
        {albums
          .filter((album) => album.type === "SINGLE")
          .map((v, vIndex) => itemsMapFn(v, vIndex, "singles"))}
      </TabsContent>
    </Tabs>
  );
}
