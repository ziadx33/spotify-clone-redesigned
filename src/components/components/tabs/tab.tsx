"use client";

import { Button } from "@/components/ui/button";
import { useTabs } from "@/hooks/use-tabs";
import { cn } from "@/lib/utils";
import { usePathname, useRouter } from "next/navigation";
import { type ReactNode, useEffect, useRef, useState } from "react";
import { BsX } from "react-icons/bs";
import { type IconType } from "react-icons/lib";

type TabProps = {
  title: string;
  Icon: IconType;
  iconSize?: number;
  gap?: number;
  href: string;
  deleteData?: {
    id: string;
  };
  currentContent?: ReactNode;
};

export function Tab({
  title,
  Icon,
  href,
  deleteData,
  gap = 8,
  iconSize = 30,
  currentContent,
}: TabProps) {
  const pathname = usePathname();
  const router = useRouter();
  const getIsCurrentTab = (href: string) => pathname === href;
  const [isCurrentTab, setIsCurrentTab] = useState(getIsCurrentTab(href));
  const currentTabRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    setIsCurrentTab(getIsCurrentTab(href));
    currentTabRef.current?.scrollIntoView();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);
  const { removeTab, changeCurrentTab, getTabByHref, data: tabs } = useTabs();
  const removeHandler = async (id: string) => {
    await removeTab(id);
  };
  const titleSpan = (
    <span
      className={cn(
        "w-40 truncate text-start text-sm",
        isCurrentTab ? "text-white" : "text-muted-foreground",
      )}
    >
      {title}
    </span>
  );
  const changePageHandler = async () => {
    const tab = getTabByHref(href);
    router.push(href);
    if (!tab) return;
    await changeCurrentTab({
      id: tab?.id ?? "",
      tabIds: tabs?.map((tab) => tab.id) ?? [],
    });
  };
  return (
    <Button
      ref={currentTabRef}
      variant="ghost"
      className={cn(
        "relative  flex w-64 p-0",
        isCurrentTab ? "bg-muted font-semibold" : "font-normal",
      )}
      asChild
    >
      <div className="flex size-full">
        <button
          onClick={!isCurrentTab ? changePageHandler : undefined}
          className="mr-auto flex h-full w-[85%] items-center justify-start pl-3"
        >
          <Icon
            size={iconSize}
            style={{
              marginRight: `${gap}px`,
            }}
          />
          {currentContent && isCurrentTab ? currentContent : titleSpan}
        </button>
        {deleteData && (
          <Button
            custom-id="remove"
            variant="ghost"
            className="absolute right-2 top-1/2 z-10 -translate-y-1/2"
            size="sm"
            onClick={() => removeHandler(deleteData.id)}
          >
            <BsX custom-id="remove" />
          </Button>
        )}
      </div>
    </Button>
  );
}
