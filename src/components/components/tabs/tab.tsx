"use client";

import { Button } from "@/components/ui/button";
import { useTabs } from "@/hooks/use-tabs";
import { cn } from "@/lib/utils";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
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
};

export function Tab({
  title,
  Icon,
  href,
  deleteData,
  gap = 8,
  iconSize = 30,
}: TabProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isCurrentTab, setIsCurrentTab] = useState(
    `${location.pathname}${location.search}` === href,
  );
  const currentTabRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    setIsCurrentTab(`${location.pathname}${location.search}` === href);
    currentTabRef.current?.scrollIntoView();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);
  const { removeTab } = useTabs();
  const removeHandler = async (id: string) => {
    await removeTab(id);
  };
  return (
    <Button
      ref={currentTabRef}
      variant="ghost"
      className={cn(
        "relative  flex w-64 p-0",
        isCurrentTab ? "font-semibold" : "font-normal",
      )}
      asChild
    >
      <div className="flex size-full">
        <button
          onClick={() => router.push(href)}
          className="mr-auto flex h-full w-[85%] items-center justify-start pl-3"
        >
          <Icon
            size={iconSize}
            style={{
              marginRight: `${gap}px`,
            }}
          />
          <span className="w-40 truncate text-start">{title}</span>
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
