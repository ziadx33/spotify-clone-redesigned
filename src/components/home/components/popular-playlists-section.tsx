import { SectionItem } from "@/components/components/section-item";
import { RenderSectionItems } from "@/components/render-section-items";
import { useSession } from "@/hooks/use-session";
import { getPopularPlaylists } from "@/server/actions/playlist";
import { useQuery } from "@tanstack/react-query";

export function PopularPlaylistsSection() {
  const { data: user } = useSession();
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
