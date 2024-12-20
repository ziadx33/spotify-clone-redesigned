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
import { type ReactNode, useMemo, useCallback, useState } from "react";
import { RiPlayListLine } from "react-icons/ri";
import { useDispatch } from "react-redux";
import { DEFAULT_SECTIONS } from "./prefrences-provider";
import { useUserData } from "@/hooks/use-user-data";

type SelectFromLibraryButtonProps = {
  children: ReactNode;
};

export function SelectFromLibraryButton({
  children,
}: SelectFromLibraryButtonProps) {
  const user = useUserData();
  const {
    data: { data: playlists },
  } = usePlaylists();
  const dispatch = useDispatch<AppDispatch>();
  const { data: prefrence } = usePrefrences();

  const userPlaylists = useMemo(
    () =>
      playlists?.filter(
        (playlist) =>
          playlist.creatorId === user?.id &&
          !prefrence?.homeLibSection.includes(playlist.id),
      ),
    [playlists, prefrence?.homeLibSection, user?.id],
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
        userId: user?.id ?? "",
      });
      void revalidate("/");
    },
    [
      dispatch,
      prefrence?.homeLibSection,
      prefrence?.homeSectionsSort,
      user?.id,
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
