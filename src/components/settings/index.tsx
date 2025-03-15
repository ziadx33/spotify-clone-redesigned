"use client";

/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { useMemo, useState } from "react";
import { Setting } from "./components/setting";
import { type User } from "@prisma/client";
import { cn } from "@/lib/utils";
import { useSettings } from "@/hooks/use-settings";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";

export function Settings({ user }: { user?: User | null }) {
  const [settingsItems, setSettingsItems] = useSettings({ user });
  const settingItemsKeys = useMemo(() => {
    if (!settingsItems) return [];
    return Object.keys(settingsItems);
  }, [settingsItems]);

  const settingTabs = useMemo(() => {
    return settingItemsKeys.map((key) => {
      return (
        <TabsTrigger
          value={key}
          key={key}
          defaultChecked={key === "display"}
          className="w-full lg:justify-start"
        >
          {key}
        </TabsTrigger>
      );
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settingsItems]);

  const settingsContent = useMemo(() => {
    return settingItemsKeys.map((key) => {
      const itemSettings = settingsItems?.[key];

      return (
        <TabsContent value={key} key={key} className="w-full">
          <div key={key} className="flex w-full flex-col">
            <h2 className="mb-6 text-3xl font-semibold">{key}</h2>
            <div className="flex flex-col gap-3">
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
        </TabsContent>
      );
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settingsItems]);

  return (
    <div className="container mx-auto h-full p-8">
      <div
        className={cn(
          "flex h-full flex-col",
          settingsItems ? "gap-4" : "gap-2",
        )}
      >
        <Tabs
          className="flex h-full flex-row gap-6 max-lg:flex-col"
          defaultValue="display"
        >
          <TabsList className="flex h-full w-full lg:max-w-56 lg:flex-col">
            {settingTabs}
          </TabsList>
          {settingsContent}
        </Tabs>
      </div>
    </div>
  );
}
