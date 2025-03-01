import { SectionItem } from "@/components/components/section-item";
import { type User } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { SectionItemSkeleton } from "../../skeleton";
import { getFeaturingAlbums } from "@/server/actions/playlist";
import { useMemo } from "react";

type FeaturingTabProps = {
  artist: User;
  query: string | null;
};

export function FeaturingTab({ artist, query }: FeaturingTabProps) {
  const { data, isLoading } = useQuery({
    queryKey: [`featuring-tab-${artist.id}`],
    queryFn: async () => {
      const res = await getFeaturingAlbums({
        artistId: artist.id,
      });
      return res.albums;
    },
  });
  const albums = useMemo(() => {
    if (isLoading) return [];
    const sortedAlbums = data?.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
    const filteredAlbums = query
      ? sortedAlbums?.filter((track) =>
          track.title.toLowerCase().includes(query?.toLowerCase().trim() ?? ""),
        )
      : [];
    return filteredAlbums?.length === 0 ? sortedAlbums : filteredAlbums;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, isLoading]);

  return (
    <div className="mt-8 flex flex-col max-lg:px-4">
      <h1 className="mb-4 text-3xl font-bold">Featuring</h1>
      <div className="flex flex-wrap">
        {!isLoading && data ? (
          albums?.map((album) => (
            <SectionItem
              playlistData={album}
              key={album.id}
              description={`${format(new Date(album.createdAt), "YYY")}`}
              link={`/playlist/${album.id}`}
              image={album.imageSrc}
              title={album.title}
              alt={album.title}
              type="PLAYLIST"
              showPlayButton
            />
          ))
        ) : (
          <SectionItemSkeleton amount={5} />
        )}
        {albums?.length === 0 ? <h1>There is no features</h1> : null}
      </div>
    </div>
  );
}
