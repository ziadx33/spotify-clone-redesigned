import { getPlaylists } from "@/server/actions/playlist";
import { type User } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import { Albums } from "./components/albums";
import { cn } from "@/lib/utils";
import { getTracksByPlaylistIds } from "@/server/actions/track";
import { SectionItemSkeleton } from "../../skeleton";

type AlbumsTabProps = {
  artist: User;
  filters: FiltersStateType;
};

export type FiltersStateType = {
  viewAs: "list" | "grid";
};

export function AlbumsTab({ artist, filters }: AlbumsTabProps) {
  const { data, isLoading } = useQuery({
    queryKey: [`albums-tab-${artist.id}`],
    queryFn: async () => {
      const { data } = await getPlaylists({
        creatorId: artist.id,
        playlistIds: [],
        type: "ALBUM",
      });
      const tracks = await getTracksByPlaylistIds({
        authorId: artist.id,
        playlistIds: data?.map((playlist) => playlist.id) ?? [],
      });
      return { data, tracks };
    },
  });

  return (
    <div className="flex flex-col gap-6 pt-2">
      <section className="flex justify-between"></section>
      <div
        className={cn(
          "flex",
          filters.viewAs === "list" ? "flex-col gap-20" : "flex-row",
        )}
      >
        {!isLoading ? (
          <Albums
            filters={filters}
            artist={artist}
            albums={data?.data ?? []}
            tracks={data?.tracks ?? []}
          />
        ) : (
          <SectionItemSkeleton amount={5} />
        )}
      </div>
    </div>
  );
}
