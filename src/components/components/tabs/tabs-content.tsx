"use client";

import { PiMicrophoneStageBold } from "react-icons/pi";
import { RiPlayListLine } from "react-icons/ri";
import { TiHome } from "react-icons/ti";
import { Tab } from "./tab";
import { useTabs } from "@/hooks/use-tabs";
import { SearchTab } from "./search-tab";
import { useEffect } from "react";
import { TabSkeleton } from "@/components/artist/components/skeleton";

export function TabsContent() {
  const { data: tabs, status, error } = useTabs();
  useEffect(() => {
    if (status !== "success") return;
    const currentTabHref = tabs?.find((tab) => tab.current)?.href;
    if (
      `${location.pathname}${location.search}` !== currentTabHref &&
      currentTabHref
    ) {
      location.replace(`${location.origin}${currentTabHref}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);
  if (status === "error") throw { error };
  return (
    <div className="flex w-full gap-1.5 overflow-x-scroll">
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
                tab.type === "PLAYLIST" ? RiPlayListLine : PiMicrophoneStageBold
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
  );
}
