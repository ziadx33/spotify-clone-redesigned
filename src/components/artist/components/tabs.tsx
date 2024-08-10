"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { HomeTab } from "./tabs/home-tab/home-tab";
import { type User } from "@prisma/client";
import { AlbumsTab, type FiltersStateType } from "./tabs/albums-tab/albums-tab";
import { SinglesTab } from "./tabs/singles-tab/singles-tab";
import { AboutTab } from "./tabs/about-tab/about-tab";
import { Control } from "./tabs/albums-tab/components/control";
import { FeaturingTab } from "./tabs/featuring-tab/featuring-tab";
import { useSearch } from "@/hooks/use-search";
import { Navigate } from "@/components/navigate";
import { useNavigate } from "@/hooks/use-navigate";
export const tabs = [
  "home",
  "albums",
  "singles",
  "about",
  "featuring",
] as const;

type TabsSectionProps = {
  artist: User;
  playlistId: string;
};

export function TabsSection({ artist, playlistId }: TabsSectionProps) {
  const {
    unDebouncedValues: { tab: currentTab },
    setQuery,
  } = useSearch<{ tab: (typeof tabs)[number] }>({
    data: {
      tab: tabs[0],
    },
  });
  const navigate = useNavigate({});
  const [filters, setFilters] = useState<FiltersStateType>({
    viewAs: "grid",
  });
  return (
    <Tabs
      value={currentTab ?? "home"}
      onValueChange={(e) => {
        setQuery({ name: "tab", value: e });
      }}
    >
      <div className="flex justify-between">
        <TabsList defaultValue={currentTab ?? "home"} className="flex w-fit">
          {tabs.map((tab) => (
            <TabsTrigger key={tab} value={tab} className="w-fit min-w-36">
              {tab}
            </TabsTrigger>
          ))}
        </TabsList>
        {currentTab === "albums" && (
          <Control setFilters={setFilters} filters={filters} />
        )}
      </div>

      <TabsContent value="home" className="size-full">
        <HomeTab
          setCurrentTab={(value) => setQuery({ name: "tab", value })}
          artist={artist}
        />
      </TabsContent>
      <TabsContent value="albums" className="size-full">
        <AlbumsTab filters={filters} artist={artist} />
      </TabsContent>
      <TabsContent value="singles" className="size-full">
        <SinglesTab artist={artist} />
      </TabsContent>
      <TabsContent value="about" className="size-full">
        <AboutTab artist={artist} />
      </TabsContent>
      <TabsContent value="featuring" className="size-full">
        <FeaturingTab artist={artist} />
      </TabsContent>
    </Tabs>
  );
}
