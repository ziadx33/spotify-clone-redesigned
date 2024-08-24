import { type SearchQueryReturn } from "@/server/actions/search";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useSearch } from "@/hooks/use-search";
import { AllContent } from "./all-content";
import { TracksContent } from "./tracks-content";
import { AlbumsContent } from "./albums-content";
import { PlaylistsContent } from "./playlists-content";
import { ArtistsContent } from "./artists-content";
import { ProfilesContent } from "./profiles-content";
import { AddToSearchHistory } from "@/server/actions/search-history";
import { type NavigateClickParams } from "@/components/components/section-item";
import { useSession } from "@/hooks/use-session";
import { revalidate } from "@/server/actions/revalidate";

type SearchContentProps = {
  data: SearchQueryReturn;
  query: string;
};

export function SearchContent({ data, query }: SearchContentProps) {
  const tabs = [
    "all",
    "tracks",
    "albums",
    "playlists",
    "artists",
    "profiles",
  ] as const;
  const { values, setQuery } = useSearch({
    data: { tab: "all" },
  });
  const { data: user } = useSession();

  const currentTab = values.tab ?? "all";

  const searchClickFn: NavigateClickParams = async ({ data, image }) => {
    await AddToSearchHistory({
      data: {
        ...data,
        image,
        userId: user?.user?.id,
        id: undefined,
      },
    });
    revalidate("/search");
  };

  return (
    <Tabs
      defaultValue={currentTab}
      className="w-full"
      onValueChange={(e) => setQuery({ name: "tab", value: e })}
    >
      <TabsList className="mb-4">
        {tabs.map((tab) => (
          <TabsTrigger value={tab} key={tab} className="lowercase">
            {tab}
          </TabsTrigger>
        ))}
      </TabsList>
      <TabsContent value="all">
        {data.tracks?.tracks?.length > 0 && (
          <AllContent {...data} searchClickFn={searchClickFn} />
        )}
      </TabsContent>
      <TabsContent value="tracks">
        <TracksContent query={query} tracks={data.tracks} />
      </TabsContent>
      <TabsContent value="albums">
        <AlbumsContent
          query={query}
          playlists={data.playlists}
          SearchClickFn={searchClickFn}
        />
      </TabsContent>
      <TabsContent value="playlists">
        <PlaylistsContent
          SearchClickFn={searchClickFn}
          query={query}
          playlists={data.playlists}
        />
      </TabsContent>
      <TabsContent value="artists">
        <ArtistsContent
          query={query}
          users={data.authors}
          SearchClickFn={searchClickFn}
        />
      </TabsContent>
      <TabsContent value="profiles">
        <ProfilesContent
          query={query}
          users={data.authors}
          SearchClickFn={searchClickFn}
        />
      </TabsContent>
    </Tabs>
  );
}
