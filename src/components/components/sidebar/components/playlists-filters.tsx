"use client";

import { SidebarList } from "./sidebar-list";

export function PlaylistFilters() {
  return (
    <div className="flex w-full flex-col">
      {/* eslint-disable-next-line @typescript-eslint/no-unsafe-assignment */}
      {/* <Playlists currentCategory={prefrence?.currentCategory} /> */}
      <SidebarList />
    </div>
  );
}
