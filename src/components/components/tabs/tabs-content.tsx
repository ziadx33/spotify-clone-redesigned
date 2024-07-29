"use client";

import { PiMicrophoneStageBold } from "react-icons/pi";
import { RiPlayListLine } from "react-icons/ri";
import { TiHome } from "react-icons/ti";
import { Tab } from "./tab";
import { useTabs } from "@/hooks/use-tabs";
import Loading from "@/components/ui/loading";
import { SearchTab } from "./search-tab";
import { useEffect } from "react";

export function TabsContent() {
  const { data: tabs, status } = useTabs();
  useEffect(() => {
    if (status !== "success") return;
    console.log("it done");
    const currentTabHref = tabs?.find((tab) => tab.current)?.href;
    if (
      `${location.pathname}${location.search}` !== currentTabHref &&
      currentTabHref
    ) {
      location.replace(`${location.origin}${currentTabHref}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);
  if (status === "loading") return <Loading className="h-full" />;
  return (
    <div className="flex w-full gap-1.5 overflow-x-scroll">
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
    </div>
  );
}
