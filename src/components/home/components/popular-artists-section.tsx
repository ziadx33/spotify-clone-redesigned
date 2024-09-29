import { SectionItem } from "@/components/components/section-item";
import { RenderSectionItems } from "@/components/render-section-items";
import { useSession } from "@/hooks/use-session";
import { getPopularUsers } from "@/server/actions/user";
import { useQuery } from "@tanstack/react-query";

export function PopularArtistsSection() {
  const { data: user } = useSession();
  const { data, isLoading } = useQuery({
    queryKey: ["popular-artists-home-page"],
    queryFn: async () => {
      const data = await getPopularUsers({
        range: {
          to: 20,
        },
        userType: "ARTIST",
      });
      return data;
    },
    enabled: !!user,
  });
  return (
    <RenderSectionItems
      cards={data?.map((artist) => {
        return (
          <SectionItem
            artistData={artist}
            type="ARTIST"
            link={`/artist/${artist.id}?playlist=fav-artists`}
            key={artist.id}
            title={artist.name ?? ""}
            image={artist.image ?? ""}
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
