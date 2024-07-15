import { type Playlist } from "@prisma/client";
import { SectionItem } from "../../../../../components/section-item";
import { format } from "date-fns";
import { RenderCards } from "@/components/(routes)/(app)/components/render-cards";

export function AppearsOnItems({ albums }: { albums: Playlist[] }) {
  const itemsMapFn = (album: Playlist) => {
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
    <div className="flex gap-2 overflow-x-hidden">
      <RenderCards cards={albums.map(itemsMapFn)} />
    </div>
  );
}
