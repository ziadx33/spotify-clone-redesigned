"use client";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { usePlaylists } from "@/hooks/use-playlists";
import { usePrefrences } from "@/hooks/use-prefrences";
import { editUserPrefrence } from "@/server/actions/prefrence";
import { revalidate } from "@/server/actions/revalidate";
import { editPrefrence } from "@/state/slices/prefrence";
import { type AppDispatch } from "@/state/store";
import { useSession } from "next-auth/react";
import { type ReactNode, useMemo, useCallback, useState } from "react";
import { RiPlayListLine } from "react-icons/ri";
import { useDispatch } from "react-redux";
import { DEFAULT_SECTIONS } from "./prefrences-provider";

type SelectFromLibraryButtonProps = {
  children: ReactNode;
};

export function SelectFromLibraryButton({
  children,
}: SelectFromLibraryButtonProps) {
  const { data: user } = useSession();
  const {
    data: { data: playlists },
  } = usePlaylists();
  const dispatch = useDispatch<AppDispatch>();
  const { data: prefrence, error, status } = usePrefrences();
  console.log("lah w mesh", status, prefrence);

  const userPlaylists = useMemo(
    () =>
      playlists?.filter(
        (playlist) =>
          playlist.creatorId === user?.user?.id &&
          !prefrence?.homeLibSection.includes(playlist.id),
      ),
    [playlists, prefrence?.homeLibSection, user?.user?.id],
  );

  const selectHandler = useCallback(
    async (value: string) => {
      const libs = [...(prefrence?.homeLibSection ?? []), value] ?? [];
      const sortData =
        [
          userPlaylists?.find((playlist) => playlist.id === value)?.title ?? "",
          ...(prefrence?.homeSectionsSort ?? DEFAULT_SECTIONS),
        ] ?? [];
      const data = {
        homeLibSection: libs,
        homeSectionsSort: sortData,
      };
      dispatch(editPrefrence(data));
      await editUserPrefrence({
        data,
        error,
        type: "set",
        userId: user?.user.id ?? "",
      });
      revalidate("/");
    },
    [
      dispatch,
      error,
      prefrence?.homeLibSection,
      prefrence?.homeSectionsSort,
      user?.user.id,
      userPlaylists,
    ],
  );

  const [opened, setOpened] = useState(false);

  return (
    <>
      <DropdownMenu open={opened} onOpenChange={setOpened}>
        <DropdownMenuTrigger className="w-full">{children}</DropdownMenuTrigger>
        <DropdownMenuContent className="-top-4 w-96 p-0">
          <Command>
            <CommandInput placeholder="Find a playlist" />
            <CommandEmpty>No playlist found.</CommandEmpty>
            <CommandList>
              <CommandGroup>
                {userPlaylists?.map((playlist) => (
                  <CommandItem
                    key={playlist.id}
                    value={playlist.id}
                    onSelect={(selectedItem) => {
                      void selectHandler(selectedItem);
                      setOpened(false);
                    }}
                  >
                    <RiPlayListLine className="mr-2 h-4 w-4" />
                    {playlist.title}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
