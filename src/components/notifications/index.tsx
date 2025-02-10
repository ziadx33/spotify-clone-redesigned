"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { NewReleasesTab } from "./components/new-releases-tab";
import { FeatureRequestsTab } from "./components/feature-requests-tab";
import { useUserData } from "@/hooks/use-user-data";

export function Notifications() {
  const user = useUserData();
  if (user.type === "USER") return <NewReleasesTab />;
  return (
    <Tabs defaultValue="new-releases" className="p-4">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="new-releases">New Releases</TabsTrigger>
        <TabsTrigger value="feature-requests">Feature Requests</TabsTrigger>
      </TabsList>
      <TabsContent value="new-releases">
        <NewReleasesTab />
      </TabsContent>
      <TabsContent value="feature-requests">
        <FeatureRequestsTab />
      </TabsContent>
    </Tabs>
  );
}
