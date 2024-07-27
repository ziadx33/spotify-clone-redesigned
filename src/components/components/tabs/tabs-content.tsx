"use client";

import { PiMicrophoneStageBold } from "react-icons/pi";
import { RiPlayListLine } from "react-icons/ri";
import { SlMagnifier } from "react-icons/sl";
import { TiHome } from "react-icons/ti";
import { Tab } from "./tab";
import { useTabs } from "@/hooks/use-tabs";
import Loading from "@/components/ui/loading";

export function TabsContent() {
  const { data: tabs, status } = useTabs();
  if (status === "loading") return <Loading className="h-full" />;
  return (
    <div className="flex w-full overflow-x-scroll">
      <Tab title="Home" Icon={TiHome} iconSize={23} href={"/home"} />
      <Tab
        title="Search"
        Icon={SlMagnifier}
        gap={12}
        iconSize={20}
        href={"/search"}
      />
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
