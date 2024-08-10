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
import { SearchInput } from "@/components/components/search-input";
import { useDebounceState } from "@/hooks/use-debounce-state";
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
  const [currentTab, setCurrentTab] = useState<(typeof tabs)[number]>("home");
  const [filters, setFilters] = useState<FiltersStateType>({
    viewAs: "grid",
  });
  const [query, setQuery, debouncedQuery] = useDebounceState<string | null>(
    null,
    300,
  );
  return (
    <Tabs
      value={currentTab ?? "home"}
      onValueChange={(e) => {
        setCurrentTab(e as (typeof tabs)[number]);
      }}
    >
      <div className="flex justify-between">
        <div className="flex items-center gap-2">
          <TabsList defaultValue={currentTab ?? "home"} className="flex w-fit">
            {tabs.map((tab) => (
              <TabsTrigger key={tab} value={tab} className="w-fit min-w-36">
                {tab}
              </TabsTrigger>
            ))}
          </TabsList>
          {(currentTab ?? "home") !== "home" &&
            (currentTab ?? "home") !== "about" && (
              <SearchInput reverse value={query} setTrackQuery={setQuery} />
            )}
        </div>
        <div>
          {currentTab === "albums" && (
            <Control setFilters={setFilters} filters={filters} />
          )}
        </div>
      </div>

      <TabsContent value="home" className="size-full">
        <HomeTab setCurrentTab={setCurrentTab} artist={artist} />
      </TabsContent>
      <TabsContent value="albums" className="size-full">
        <AlbumsTab filters={filters} query={debouncedQuery} artist={artist} />
      </TabsContent>
      <TabsContent value="singles" className="size-full">
        <SinglesTab query={debouncedQuery} artist={artist} />
      </TabsContent>
      <TabsContent value="about" className="size-full">
        <AboutTab artist={artist} />
      </TabsContent>
      <TabsContent value="featuring" className="size-full">
        <FeaturingTab query={debouncedQuery} artist={artist} />
      </TabsContent>
    </Tabs>
  );
}
