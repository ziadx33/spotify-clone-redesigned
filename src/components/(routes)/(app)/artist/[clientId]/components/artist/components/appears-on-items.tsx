import { type Playlist } from "@prisma/client";
import { SectionItem } from "./section-item";
import { format } from "date-fns";

export function AppearsOnItems({ albums }: { albums: Playlist[] }) {
  const itemsMapFn = (album: Playlist) => {
    return (
      <SectionItem
        key={album.id}
        alt={album.title}
        showPlayButton
        title={album.title}
        image={album.imageSrc}
        description={`${format(new Date(album.createdAt), "YYY")} - ${album.type.toLowerCase()}`}
        link={`/playlist/${album.id}`}
      />
    );
  };
  return <div className="flex gap-2">{albums.map(itemsMapFn)}</div>;
}
