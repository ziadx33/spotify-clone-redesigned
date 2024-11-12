"use client";

import { Button } from "@/components/ui/button";
import { useIsCurrentTab } from "@/hooks/use-get-is-current-tab";
import { useTabs } from "@/hooks/use-tabs";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { type ReactNode } from "react";
import { BsX } from "react-icons/bs";
import { type IconType } from "react-icons/lib";

type TabProps = {
  title: string;
  Icon?: IconType;
  iconSize?: number;
  gap?: number;
  href: string;
  deleteData?: {
    id: string;
  };
  currentContent?: ReactNode;
  alwaysCurrentContent?: boolean;
  onClick?: () => void;
};

export function Tab({
  title,
  Icon,
  href,
  deleteData,
  gap = 8,
  iconSize = 30,
  currentContent,
  alwaysCurrentContent,
  onClick,
}: TabProps) {
  const { isCurrentTab, currentTabRef } = useIsCurrentTab(href);
  const { removeTab } = useTabs();
  const router = useRouter();

  const removeHandler = async (id: string) => {
    await removeTab(id);
  };
  const changePageHandler = async () => {
    onClick?.();
    router.push(href);
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

  return (
    <Button
      ref={currentTabRef}
      variant="ghost"
      className={cn(
        "relative  flex w-64 shrink-0 p-0",
        isCurrentTab ? "bg-muted font-semibold" : "font-normal",
      )}
      asChild
    >
      <div className="flex size-full">
        <button
          onClick={!isCurrentTab ? changePageHandler : undefined}
          className="mr-auto flex h-full w-[85%] items-center justify-start pl-3"
        >
          {Icon && (
            <Icon
              size={iconSize}
              style={{
                marginRight: `${gap}px`,
              }}
            />
          )}
          {!!(currentContent && isCurrentTab) || !!alwaysCurrentContent
            ? currentContent
            : titleSpan}
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
