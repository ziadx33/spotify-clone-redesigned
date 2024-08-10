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
export const tabs = [
  "home",
  "albums",
  "singles",
  "about",
  "featuring",
] as const;

export function TabsSection({ artist }: { artist: User }) {
  const [currentTab, setCurrentTab] = useState<(typeof tabs)[number]>(tabs[1]);
  const [filters, setFilters] = useState<FiltersStateType>({
    viewAs: "grid",
  });
  return (
    <Tabs
      value={currentTab}
      onValueChange={(e) => setCurrentTab(e as (typeof tabs)[number])}
    >
      <div className="flex justify-between">
        <TabsList className="flex w-fit">
          {tabs.map((tab) => (
            <TabsTrigger className="w-fit min-w-36" key={tab} value={tab}>
              {tab}
            </TabsTrigger>
          ))}
        </TabsList>
        {currentTab === "albums" && (
          <Control setFilters={setFilters} filters={filters} />
        )}
      </div>

      <TabsContent value="home" className="size-full">
        <HomeTab setCurrentTab={setCurrentTab} artist={artist} />
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
