"use client";

/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { useMemo } from "react";
import { Setting } from "./components/setting";
import { type User } from "@prisma/client";
import { SkeletonSettings } from "./components/skeleton-setting";
import { cn } from "@/lib/utils";
import { useSettings } from "@/hooks/use-settings";

export function Settings({ user }: { user: User }) {
  const [settingsItems, setSettingsItems] = useSettings({ user });

  const settingsContent = useMemo(() => {
    if (!settingsItems) return;
    return Object.keys(settingsItems).map((key) => {
      const itemSettings = settingsItems[key];

      return (
        <div key={key} className="flex w-full flex-col">
          <h2 className="mb-2.5 text-xl font-semibold">{key}</h2>
          <div className="flex flex-col gap-1.5">
            {itemSettings
              ?.sort((a, b) => a.order - b.order)
              .map((setting) => {
                return (
                  <Setting
                    setSettingsItems={setSettingsItems}
                    itemSettingsKey={key}
                    setting={setting}
                    key={setting.title}
                  />
                );
              })}
          </div>
        </div>
      );
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settingsItems]);

  return (
    <div className="container mx-auto p-8">
      <div className="mb-10 flex justify-between">
        <h1 className="text-3xl font-bold">Settings</h1>
      </div>
      <div className={cn("flex flex-col", settingsItems ? "gap-4" : "gap-2")}>
        {settingsItems ? settingsContent : <SkeletonSettings />}
      </div>
    </div>
  );
}
