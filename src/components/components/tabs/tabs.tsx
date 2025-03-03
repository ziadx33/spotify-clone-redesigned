"use client";

import { getTabs } from "@/server/queries/tab";
import { TabsContent } from "./components/tabs-content";
import { TabsProvider } from "./components/tabs-provider";
import { useUserData } from "@/hooks/use-user-data";
import { useQuery } from "@tanstack/react-query";

export function Tabs() {
  const user = useUserData();
  const { data: tabs } = useQuery({
    queryKey: ["tabs"],
    queryFn: async () => {
      return await getTabs({ userId: user.id ?? "" });
    },
  });

  return (
    <TabsProvider tabs={tabs}>
      <TabsContent />
    </TabsProvider>
  );
}
