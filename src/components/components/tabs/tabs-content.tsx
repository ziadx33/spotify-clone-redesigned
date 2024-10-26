"use client";

import { PiMicrophoneStageBold } from "react-icons/pi";
import { RiPlayListLine } from "react-icons/ri";
import { TiHome } from "react-icons/ti";
import { Tab } from "./tab";
import { useTabs } from "@/hooks/use-tabs";
import { SearchTab } from "./search-tab";
import { TabSkeleton } from "@/components/artist/components/skeleton";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

export function TabsContent() {
  const { data: tabs, status, error } = useTabs();
  if (status === "error") throw { error };
  return (
    <ScrollArea className="ml-2 w-full whitespace-nowrap">
      <div className="flex w-full gap-1.5">
        {status === "success" ? (
          <>
            <Tab title="Home" Icon={TiHome} iconSize={23} href={"/"} />
            <SearchTab />
            {tabs?.map((tab) => (
              <Tab
                key={tab.id}
                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                title={tab.title ?? ""}
                deleteData={{ id: tab.id }}
                Icon={
                  tab.type === "PLAYLIST"
                    ? RiPlayListLine
                    : PiMicrophoneStageBold
                }
                iconSize={20}
                href={tab.href ?? ""}
              />
            ))}
          </>
        ) : (
          <TabSkeleton amount={5} />
        )}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
}
