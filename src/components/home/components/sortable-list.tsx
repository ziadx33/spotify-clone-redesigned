"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { usePrefrences } from "@/hooks/use-prefrences";
import { cn } from "@/lib/utils";
import { editUserPrefrence } from "@/server/actions/prefrence";
import { revalidate } from "@/server/actions/revalidate";
import { editPrefrence } from "@/state/slices/prefrence";
import { type AppDispatch } from "@/state/store";
import { type MouseEventHandler, useCallback, type ReactNode } from "react";
import { BsPinAngle, BsPlus } from "react-icons/bs";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { MdDragIndicator, MdMenu } from "react-icons/md";
import { useDispatch } from "react-redux";
import {
  SortableContainer,
  SortableElement,
  arrayMove,
} from "react-sortable-hoc";
import { SelectFromLibraryButton } from "./select-from-library-button";
import { useUserData } from "@/hooks/use-user-data";
import { SortableListItems } from "./sortable-list-items";

type ItemType = {
  title: string;
  draggable: boolean;
  id: string;
  isPinned?: boolean;
  isHidden?: boolean;
};

function SortableItem(item: ItemType) {
  const dispatch = useDispatch<AppDispatch>();
  const { data, error } = usePrefrences();
  const user = useUserData();

  const handler = async (text: "pinnedHomeSections" | "hiddenHomeSections") => {
    const sections = item[
      text === "pinnedHomeSections" ? "isPinned" : "isHidden"
    ]
      ? data?.[text].filter((section) => section !== item.title)
      : [...(data?.[text] ?? []), item.title];

    dispatch(
      editPrefrence({
        [text]: sections,
      }),
    );

    const res = await editUserPrefrence({
      data: {
        [text]: sections,
      },
      userId: user?.id ?? "",
    });
    if (error) dispatch(editPrefrence(res));
    void revalidate("/");
  };

  const pinToggle: MouseEventHandler<HTMLButtonElement> = (e) => {
    e.stopPropagation();
    void handler("pinnedHomeSections");
  };

  const hideHandler: MouseEventHandler<HTMLButtonElement> = (e) => {
    e.stopPropagation();
    void handler("hiddenHomeSections");
  };

  return (
    <DropdownMenuItem
      className={cn(
        "z-10 flex w-full items-center justify-between transition-all duration-75",
        item.isHidden ? "opacity-50" : "",
      )}
    >
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={item.draggable ? pinToggle : undefined}
          className={cn(
            "h-fit w-4",
            item.isPinned
              ? "text-primary hover:text-primary"
              : "text-secondary-foreground hover:text-secondary-foreground",
          )}
        >
          {item.draggable ? <BsPinAngle /> : <BsPlus size={15} />}
        </Button>
        <span>{item.title}</span>
      </div>
      {item.draggable && (
        <div className="buttons flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="drag-button h-full w-6 cursor-move"
          >
            <MdDragIndicator />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={hideHandler}
            className="h-full w-6"
          >
            {item.isHidden ? <FaEyeSlash /> : <FaEye />}
          </Button>
        </div>
      )}
    </DropdownMenuItem>
  );
}

const Item = SortableElement<ItemType>((item: ItemType) => (
  <SortableItem {...item} />
));

type SortableItemsType = {
  items: ItemType[];
};

export const SortableItems = SortableContainer<SortableItemsType>(
  ({ items }: SortableItemsType) => {
    return (
      <div className="w-full">
        {items.map((item, i) => (
          <Item index={i} key={item.id} {...item} />
        ))}
      </div>
    );
  },
);

export type GetItemsType = (
  strings?: string[],
  showArr?: boolean,
) => ItemType[];

export type SortEndType = (
  {
    oldIndex,
    newIndex,
  }: {
    oldIndex: number;
    newIndex: number;
  },
  strings: string[] | undefined,
  prop: "pinnedHomeSections" | "homeSectionsSort",
) => void;

export function SortableList({ comps }: { comps: Record<string, ReactNode> }) {
  const { data, error } = usePrefrences();
  const dispatch = useDispatch<AppDispatch>();
  const user = useUserData();
  const arr = Object.keys(comps);

  const getItems = useCallback(
    (strings?: string[], showArr?: boolean) => {
      return (
        (strings?.length ?? 0 > 0 ? strings : showArr ? arr : null)?.map(
          (section) => ({
            id: section,
            title: section,
            draggable: true,
            isPinned: data?.pinnedHomeSections.includes(section),
            isHidden: data?.hiddenHomeSections.includes(section),
          }),
        ) ?? []
      );
    },
    [arr, data],
  );

  const sortEnd: (
    { oldIndex, newIndex }: { oldIndex: number; newIndex: number },
    strings: string[] | undefined,
    prop: "pinnedHomeSections" | "homeSectionsSort",
  ) => void = useCallback(
    ({ oldIndex, newIndex }, strings, prop) => {
      const updatedSortOrder = arrayMove(strings ?? [], oldIndex, newIndex);

      dispatch(
        editPrefrence({
          [prop]: updatedSortOrder,
        }),
      );

      void (async () => {
        const res = await editUserPrefrence({
          data: {
            [prop]: updatedSortOrder,
          },
          userId: user?.id ?? "",
        });
        if (error) dispatch(editPrefrence(res));
        void revalidate("/");
      })();
    },
    [dispatch, error, user?.id],
  );

  const content = (
    <>
      <DropdownMenuSub>
        <SelectFromLibraryButton>
          <SortableItem
            draggable={false}
            title="Select from library"
            id="select-from"
          />
        </SelectFromLibraryButton>
      </DropdownMenuSub>
      <SortableListItems
        getItems={getItems}
        items={data?.pinnedHomeSections}
        sortEnd={sortEnd}
      />
      <SortableListItems
        getItems={getItems}
        items={data?.homeSectionsSort}
        filter={(item) => !data?.pinnedHomeSections.includes(item.id)}
        sortEnd={sortEnd}
        fallback={arr}
      />
    </>
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <MdMenu />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="sortable-items z-40 w-96 bg-transparent backdrop-blur-3xl">
        <DropdownMenuLabel>Customize feed</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {(user?.tracksHistory.length ?? 0) > 0 ? (
          content
        ) : (
          <h3 className="p-3 text-center">
            Listen to a few tracks to help personalize and organize the sections
            on the homepage!
          </h3>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
