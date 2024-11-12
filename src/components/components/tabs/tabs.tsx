import { getServerAuthSession } from "@/server/auth";
import { TabsContent } from "./components/tabs-content";
import { TabsProvider } from "./components/tabs-provider";
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
