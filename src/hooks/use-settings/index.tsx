import { DEFAULT_SECTIONS } from "@/components/home/components/prefrences-provider";
import { editUserPrefrence } from "@/server/actions/prefrence";
import { editPrefrence } from "@/state/slices/prefrence";
import { type AppDispatch } from "@/state/store";
import { useState, useRef, useEffect } from "react";
import { useDispatch } from "react-redux";
import { toast } from "sonner";
import { $Enums, type User } from "@prisma/client";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { deleteUserById } from "@/server/actions/user";
import { usePrefrences } from "../use-prefrences";
import { SwitchToArtistDialog } from "./components/swith-to-artist-dialog";
import { type SettingsItems } from "./types";
import { FaMoon, FaSun } from "react-icons/fa";
import { RiComputerLine } from "react-icons/ri";
import { useUpdateUser } from "../use-update-user";

export function useSettings({ user }: { user?: User | null }) {
  const { data: prefrences, error: prefrencesError } = usePrefrences();
  const dispatch = useDispatch<AppDispatch>();
  const [settingsItems, setSettingsItems] = useState<SettingsItems | null>(
    null,
  );
  const router = useRouter();
  const isDoneRef = useRef(false);
  const { update: updateUser } = useUpdateUser();

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
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          defaultOption: user.theme ?? "dark",
          placehoder: "select a theme",
          options: [
            {
              title: "system",
              // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
              value: $Enums.USER_THEME.SYSTEM,
              onSelect: async () => {
                await updateUser({ data: { theme: "SYSTEM" } });
                return;
              },
              icon: <RiComputerLine />,
            },
            {
              title: "light",
              // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
              value: $Enums.USER_THEME.LIGHT,
              onSelect: async () => {
                await updateUser({ data: { theme: "LIGHT" } });
                return;
              },
              icon: <FaSun />,
            },
            {
              title: "dark",
              // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
              value: $Enums.USER_THEME.DARK,
              onSelect: async () => {
                await updateUser({ data: { theme: "DARK" } });
                return;
              },
              icon: <FaMoon />,
            },
          ],
        },
        {
          order: 2,
          title: "reset home page prefrences",
          type: "BUTTON",
          value: "reset",
          onEvent: async () => {
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
              type: "ALERT",
              order: 5,
              alertTitle: "switch to user mode",
              title: "switch to user mode",
              value: "switch",
              description:
                "This action will switch your account to user mode. Are you sure you want to switch?",
              onEvent: async () => {
                await updateUser({ data: { type: "USER" } });
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
