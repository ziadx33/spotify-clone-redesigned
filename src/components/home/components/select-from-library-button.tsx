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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { usePlaylists } from "@/hooks/use-playlists";
import { usePrefrences } from "@/hooks/use-prefrences";
import { editUserPrefrence } from "@/server/actions/prefrence";
import { revalidate } from "@/server/actions/revalidate";
import { editPrefrence } from "@/state/slices/prefrence";
import { type AppDispatch } from "@/state/store";
import { useSession } from "next-auth/react";
import {
  type ReactNode,
  useMemo,
  useCallback,
  type Dispatch,
  type SetStateAction,
} from "react";
import { RiPlayListLine } from "react-icons/ri";
import { useDispatch } from "react-redux";

type SelectFromLibraryButtonProps = {
  children: ReactNode;
  open: boolean;
  setOpen?: Dispatch<SetStateAction<boolean>>;
};

export function SelectFromLibraryButton({
  children,
  open,
  setOpen,
}: SelectFromLibraryButtonProps) {
  const { data: user } = useSession();
  const { data: playlists } = usePlaylists();
  const dispatch = useDispatch<AppDispatch>();
  const { data: prefrence, error } = usePrefrences();

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
          ...(prefrence?.homeSectionsSort ?? []),
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

  return (
    <>
      <Popover open={open} onOpenChange={setOpen} modal>
        <PopoverTrigger className="w-full">{children}</PopoverTrigger>
        <PopoverContent className="-top-4 w-96 p-0">
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
                      setOpen?.(false);
                      void selectHandler(selectedItem);
                    }}
                  >
                    <RiPlayListLine className="mr-2 h-4 w-4" />
                    {playlist.title}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </>
  );
}
