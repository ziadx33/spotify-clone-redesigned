import { DEFAULT_SECTIONS } from "@/components/home/components/prefrences-provider";
import { editUserPrefrence } from "@/server/actions/prefrence";
import { revalidate } from "@/server/actions/revalidate";
import { editPrefrence } from "@/state/slices/prefrence";
import { type AppDispatch } from "@/state/store";
import { useState, useRef, useEffect, type ReactNode } from "react";
import { useDispatch } from "react-redux";
import { toast } from "sonner";
import { type User } from "@prisma/client";
import { type ButtonProps } from "@/components/ui/button";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { deleteUserById } from "@/server/actions/user";
import { usePrefrences } from "../use-prefrences";
import { SwitchToArtistDialog } from "./components/swith-to-artist-dialog";

type DefSetting = {
  title: string;
  // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
  onEvent: () => unknown | Promise<unknown>;
  order: number;
};

export type ButtonSetting = {
  type: "BUTTON";
  value: string;
  variant?: ButtonProps["variant"];
} & DefSetting;

export type SwitchSetting = {
  type: "SWITCH";
  value: boolean;
  // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
  onEvent: (value: boolean) => unknown | Promise<unknown>;
} & Omit<DefSetting, "onEvent">;

export type DialogSetting = {
  type: "DIALOG";
  content: ReactNode;
  value: string;
  // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
} & Omit<ButtonSetting, "onEvent" | "type">;

export type AlertSetting = {
  type: "ALERT";
  description: string;
  alertTitle: string;
  value: string;
  // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
} & Omit<ButtonSetting, "type">;

export type DropdownSettingOption = {
  title: string;
  onSelect: DefSetting["onEvent"];
};

export type DropdownSetting = {
  type: "DROPDOWN";
  defaultOption: string;
  options: DropdownSettingOption[];
} & Omit<DefSetting, "onEvent">;

export type Setting =
  | ButtonSetting
  | SwitchSetting
  | DialogSetting
  | AlertSetting
  | DropdownSetting;

export type SettingsItems = Record<string, Setting[]>;

export function useSettings({ user }: { user?: User | null }) {
  const { data: prefrences, error: prefrencesError } = usePrefrences();
  const dispatch = useDispatch<AppDispatch>();
  const [settingsItems, setSettingsItems] = useState<SettingsItems | null>(
    null,
  );
  const router = useRouter();
  const isDoneRef = useRef(false);

  useEffect(() => {
    if ((!prefrences && !prefrencesError) || !user) return;
    if (isDoneRef.current) return;
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
              userId: user.id,
            });
          },
        },
        {
          order: 1,
          title: "choose your preferred theme",
          type: "DROPDOWN",
          defaultOption: "light",
          options: [{ title: "light", onSelect: () => {} }],
        },
        {
          order: 2,
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
              userId: user.id,
            });
          },
        },
        user.type === "USER"
          ? {
              type: "DIALOG",
              order: 5,
              title: "switch to artist mode",
              content: <SwitchToArtistDialog />,
              value: "switch",
            }
          : {
              type: "BUTTON",
              order: 5,
              title: "switch to normal user mode",
              value: "switch",
              onEvent() {
                console.log("hi");
              },
            },
      ],
      ["account management"]: [
        {
          title: "sign out of your account",
          type: "BUTTON",
          value: "logout",
          order: 0,
          onEvent: async () => {
            await signOut();
            router.push("/");
          },
        },
        {
          title: "update your password",
          type: "BUTTON",
          value: "change password",
          order: 1,
          onEvent: () => {
            router.push(`/artist/${user.id}/change-password`);
          },
        },
        {
          type: "ALERT",
          title: "permanently delete your account",
          value: "delete account",
          order: 2,
          onEvent: async () => {
            await deleteUserById(user.id);
            revalidate("/login");
            revalidate("/register");
            revalidate("/");
            await signOut();
          },
          variant: "destructive",
          alertTitle: "We're sorry to see you go!",
          description:
            "This action is permanent and will erase all your data. Are you sure you want to delete your account?",
        },
      ],
    });
    isDoneRef.current = true;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, prefrences, prefrencesError, router, user?.id]);

  return [settingsItems, setSettingsItems] as const;
}
