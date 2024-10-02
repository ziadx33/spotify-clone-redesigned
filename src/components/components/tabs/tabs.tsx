import { getServerAuthSession } from "@/server/auth";
import { TabsContent } from "./tabs-content";
import { TabsProvider } from "./tabs-provider";
import { getTabs } from "@/server/actions/tab";

export async function Tabs() {
  const user = await getServerAuthSession();
  const tabs = await getTabs({ userId: user?.user.id ?? "" });

  return (
    <TabsProvider tabs={tabs}>
      <TabsContent />
    </TabsProvider>
  );
}
