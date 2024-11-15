import { DEFAULT_SECTIONS } from "@/components/home/components/prefrences-provider";
import { editUserPrefrence } from "@/server/actions/prefrence";
import { revalidate } from "@/server/actions/revalidate";
import { editPrefrence } from "@/state/slices/prefrence";
import { type AppDispatch } from "@/state/store";
import { useState, useRef, useEffect } from "react";
import { useDispatch } from "react-redux";
import { toast } from "sonner";
import { usePrefrences } from "./use-prefrences";
import { type User } from "@prisma/client";
import { type ButtonProps } from "@/components/ui/button";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { deleteUserById } from "@/server/actions/user";

type DefSetting = {
  title: string;
  // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
  onEvent: () => unknown | Promise<unknown>;
  order: number;
};

export type Setting =
  | ({
      type: "BUTTON";
      value: string;
      variant?: ButtonProps["variant"];
    } & DefSetting)
  | ({
      type: "SWITCH";
      value: boolean;
      // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
      onEvent: (value: boolean) => unknown | Promise<unknown>;
    } & Omit<DefSetting, "onEvent">);

export type SettingsItems = Record<string, Setting[]>;

export function useSettings({ user }: { user: User }) {
  const { data: prefrences, error: prefrencesError } = usePrefrences();
  const dispatch = useDispatch<AppDispatch>();
  const [settingsItems, setSettingsItems] = useState<SettingsItems | null>(
    null,
  );
  const router = useRouter();
  const isDoneRef = useRef(false);

  useEffect(() => {
    if (isDoneRef.current) return;
    if (!prefrences && !prefrencesError) return;
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
          title: "permanently delete your account",
          type: "BUTTON",
          value: "delete account",
          order: 2,
          onEvent: () => {
            toast("We're sorry to see you go!", {
              description:
                "This action is permanent and will erase all your data. Are you sure you want to delete your account?",
              action: {
                label: "Delete",
                onClick: () => {
                  const fn = async () => {
                    await signOut();
                    await deleteUserById(user.id);
                  };
                  void fn();
                },
              },
            });
          },
          variant: "destructive",
        },
      ],
    });
    isDoneRef.current = true;
  }, [dispatch, prefrences, prefrencesError, router, user.id]);

  return [settingsItems, setSettingsItems] as const;
}
