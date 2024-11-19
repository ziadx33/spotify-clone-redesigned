"use client";

import { BsBell } from "react-icons/bs";
import { Button } from "../ui/button";
import { useSelector } from "react-redux";
import { type RootState } from "@/state/store";
import { useMemo } from "react";
import { useSession } from "@/hooks/use-session";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function NotificationBell() {
  const notifications = useSelector(
    (state: RootState) => state.notifications.data,
  );
  const { data: user } = useSession();
  const pathname = usePathname();
  const isCurrentRoute = pathname === "/notifications";
  const isThereIsNewNotification = useMemo(() => {
    if (!user?.user?.id) return;
    return notifications.some((notification) =>
      user?.user?.seenNotifications.includes(notification.id),
    );
  }, [notifications, user?.user?.id, user?.user?.seenNotifications]);
  return (
    <Link href="/notifications" className="size-full">
      <Button
        variant={isCurrentRoute ? "secondary" : "outline"}
        className="relative rounded-full"
        size="icon"
      >
        <BsBell />
        {!isThereIsNewNotification && !isCurrentRoute && (
          <div className="absolute bottom-2.5 right-2.5 size-2 rounded-full bg-primary" />
        )}
      </Button>
    </Link>
  );
}
