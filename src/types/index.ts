import { type Playlist, type Track, type User } from "@prisma/client";
import { type MouseEventHandler, type ReactNode } from "react";
import { type IconType } from "react-icons/lib";

export type TrackFilters = {
  title: "ASC" | "DSC" | null;
  album: "ASC" | "DSC" | null;
  artist: "ASC" | "DSC" | null;
  dateAdded: "ASC" | "DSC" | null;
  duration: "ASC" | "DSC" | null;
  sortBy: string;
  customOrder: boolean;
  viewAs: "LIST" | "COMPACT";
};

export type ElementType<T extends ReadonlyArray<unknown>> =
  T extends ReadonlyArray<infer ElementType> ? ElementType : never;

export type ChangeValueParam<T> = ((val: T) => T) | T;

export type Nullable<T> = {
  [P in keyof T]?: T[P] | null;
};

export type DropdownMenuItemType = {
  title: string;
  icon: IconType;
  content?: ReactNode;
};

export type NestedMenuType = {
  isSearchable?: boolean;
  items: DropdownMenuType[];
};

export type DropdownMenuType =
  | (DropdownMenuItemType & {
      nestedMenu: NestedMenuType;
      event?: never;
    })
  | (DropdownMenuItemType & {
      event: MouseEventHandler<HTMLDivElement>;
      nestedMenu?: never;
    });

export type GenerateMetadataProps<T extends object> = {
  params: Promise<T>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export type TracksDataType = {
  tracks: Track[];
  authors: User[];
  albums: Playlist[];
};
