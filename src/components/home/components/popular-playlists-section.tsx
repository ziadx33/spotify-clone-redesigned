import { SectionItem } from "@/components/components/section-item";
import { RenderSectionItems } from "@/components/render-section-items";
import { useUserData } from "@/hooks/use-user-data";
import { getPopularPlaylists } from "@/server/queries/playlist";
import { useQuery } from "@tanstack/react-query";

export function PopularPlaylistsSection() {
  const user = useUserData();
  const { data, isLoading } = useQuery({
    queryKey: ["popular-playlists-home-page"],
    queryFn: async () => {
      const data = await getPopularPlaylists({});
      return data;
    },
    enabled: !!user,
  });
  return (
    <RenderSectionItems
      cards={data?.playlists.map((playlist) => {
        return (
          <SectionItem
            type="PLAYLIST"
            playlistData={playlist}
            link={`/playlist/${playlist.id}`}
            key={playlist.id}
            title={playlist.title ?? ""}
            image={playlist.imageSrc ?? ""}
            showPlayButton
            imageClasses="rounded-full"
          />
        );
      })}
      isLoading={isLoading}
      title="Popular Artists"
    />
  );
}
