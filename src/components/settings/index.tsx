/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { useEffect, useMemo, useRef, useState } from "react";
import { Setting } from "./components/setting";
import { usePrefrences } from "@/hooks/use-prefrences";
import { useDispatch } from "react-redux";
import { type AppDispatch } from "@/state/store";
import { editPrefrence } from "@/state/slices/prefrence";
import { editUserPrefrence } from "@/server/actions/prefrence";
import { type User } from "@prisma/client";
import { revalidate } from "@/server/actions/revalidate";
import { DEFAULT_SECTIONS } from "../home/components/prefrences-provider";
import { toast } from "sonner";
import { SkeletonSettings } from "./components/skeleton-setting";
import { cn } from "@/lib/utils";

type DefSetting = {
  title: string;
  // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
  onEvent: () => unknown | Promise<unknown>;
  order: number;
};

export type Setting =
  | ({ type: "BUTTON"; value: string } & DefSetting)
  | ({
      type: "SWITCH";
      value: boolean;
      // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
      onEvent: (value: boolean) => unknown | Promise<unknown>;
    } & Omit<DefSetting, "onEvent">);

export type SettingsItems = Record<string, Setting[]>;

export function Settings({ user }: { user: User }) {
  const { data: prefrences, error: prefrencesError } = usePrefrences();
  console.log("eyad", prefrences);
  const dispatch = useDispatch<AppDispatch>();
  const [settingsItems, setSettingsItems] = useState<SettingsItems | null>(
    null,
  );
  const isDoneRef = useRef(false);

  useEffect(() => {
    if (isDoneRef.current) return;
    if (!prefrences) return;
    setSettingsItems({
      display: [
        {
          order: 0,
          title: "show the now-playing panel on click of play",
          type: "SWITCH",
          value: prefrences?.showPlayingView ?? true,
          onEvent: async (e) => {
            revalidate(`/artist/${user.id}/settings`);
            revalidate("/");
            const data = { showPlayingView: e };
            dispatch(editPrefrence(data));
            await editUserPrefrence({
              data,
              error: prefrencesError,
              type: "set",
              userId: user.id,
            });
          },
        },
        {
          order: 1,
          title: "reset home page prefrences",
          type: "BUTTON",
          value: "reset",
          onEvent: async () => {
            revalidate(`/artist/${user.id}/settings`);
            revalidate("/");
            const data = {
              pinnedHomeSections: [],
              hiddenHomeSections: [],
              homeSectionsSort: DEFAULT_SECTIONS,
              homeLibSection: [],
            };
            dispatch(editPrefrence(data));
            await editUserPrefrence({
              data,
              error: prefrencesError,
              type: "set",
              userId: user.id,
            });

            toast.success("reseted successfully!");
          },
        },
      ],
      social: [
        {
          title: "publish my playlists on my profile",
          type: "SWITCH",
          value: prefrences?.ShowPlaylistsInProfile ?? true,
          order: 0,
          onEvent: async (e) => {
            revalidate(`/artist/${user.id}/settings`);
            const data = { ShowPlaylistsInProfile: e };
            dispatch(editPrefrence(data));
            await editUserPrefrence({
              data,
              error: prefrencesError,
              type: "set",
              userId: user.id,
            });
          },
        },
        {
          title: "show my top playing artists on my public profile",
          type: "SWITCH",
          value: prefrences?.ShowTopPlayingArtists ?? true,
          order: 1,
          onEvent: async (e) => {
            revalidate(`/artist/${user.id}/settings`);
            const data = { ShowTopPlayingArtists: e };
            dispatch(editPrefrence(data));
            await editUserPrefrence({
              data,
              error: prefrencesError,
              type: "set",
              userId: user.id,
            });
          },
        },
        {
          title: "show my following list on my public profile",
          type: "SWITCH",
          value: prefrences?.ShowFollowingList ?? false,
          order: 2,
          onEvent: async (e) => {
            revalidate(`/artist/${user.id}/settings`);
            const data = { ShowFollowingList: e };
            dispatch(editPrefrence(data));
            await editUserPrefrence({
              data,
              error: prefrencesError,
              type: "set",
              userId: user.id,
            });
          },
        },
        {
          title: "show my followers list on my public profile",
          type: "SWITCH",
          value: prefrences?.ShowFollowingList ?? true,
          order: 3,
          onEvent: async (e) => {
            revalidate(`/artist/${user.id}/settings`);
            const data = { ShowFollowersList: e };
            dispatch(editPrefrence(data));
            await editUserPrefrence({
              data,
              error: prefrencesError,
              type: "set",
              userId: user.id,
            });
          },
        },
        {
          title: "show my top playing tracks list on my public profile",
          type: "SWITCH",
          value: prefrences?.ShowFollowingList ?? false,
          order: 4,
          onEvent: async (e) => {
            revalidate(`/artist/${user.id}/settings`);
            const data = { ShowTopPlayingTracks: e };
            dispatch(editPrefrence(data));
            await editUserPrefrence({
              data,
              error: prefrencesError,
              type: "set",
              userId: user.id,
            });
          },
        },
        {
          order: 5,
          title: "switch to artist mode",
          type: "BUTTON",
          value: "switch",
          onEvent: () => alert("3ayz amoot"),
        },
      ],
    });
    isDoneRef.current = true;
  }, [dispatch, prefrences, prefrencesError, user.id]);

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
