import { type User } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import { Albums } from "./components/albums";
import { cn } from "@/lib/utils";
import { SectionItemSkeleton } from "../../skeleton";
import { getPlaylistTracks, getPlaylists } from "@/server/queries/playlist";

type AlbumsTabProps = {
  artist: User;
  filters: FiltersStateType;
  query: string | null;
};

export type FiltersStateType = {
  viewAs: "list" | "grid";
};

export function AlbumsTab({ artist, filters, query }: AlbumsTabProps) {
  const { data, isLoading } = useQuery({
    queryKey: [`albums-tab-${artist.id}`],
    queryFn: async () => {
      const { data: data } = await getPlaylists({
        creatorId: artist.id,
        playlistIds: [],
        type: "ALBUM",
      });
      const { data: tracks } = await getPlaylistTracks({
        authorId: artist.id,
        playlistIds: data?.map((playlist) => playlist.id) ?? [],
      });
      return { data, tracks };
    },
  });

  return (
    <div className="flex flex-col gap-6 pt-2 max-lg:px-4">
      <section className="flex justify-between"></section>
      <div
        className={cn(
          "flex",
          filters.viewAs === "list" ? "flex-col gap-20" : "flex-row",
        )}
      >
        {!isLoading ? (
          <Albums
            query={query}
            filters={filters}
            artist={artist}
            data={data?.data ?? []}
            tracks={data?.tracks?.tracks ?? []}
          />
        ) : (
          <SectionItemSkeleton amount={5} />
        )}
        {data?.data?.length === 0 ? <h1>There is no singles</h1> : null}
      </div>
    </div>
  );
}
