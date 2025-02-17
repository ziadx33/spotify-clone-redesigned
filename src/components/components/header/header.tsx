"use client";

import { type ReactNode } from "react";
import { ProfileDropdownMenu } from "./components/profile-dropdown-menu";
import { NotificationBell } from "./components/notification-bell";
import { MoveArrows } from "./components/move-arrows";

export function Header({ children }: { children: ReactNode }) {
  return (
    <header className="z-10 flex h-[7%] w-full justify-between py-3 pr-8">
      <div className="flex w-full max-w-[90%] items-center gap-3">
        {children}
        {/* <PremiumButton /> */}
        <MoveArrows />
      </div>
      <div className="flex items-center gap-2">
        <NotificationBell />
        <ProfileDropdownMenu />
      </div>
    </header>
  );
}
