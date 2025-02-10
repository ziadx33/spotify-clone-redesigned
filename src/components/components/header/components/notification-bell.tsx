"use client";

import { BsBell } from "react-icons/bs";
import { Button } from "../../../ui/button";
import { useSelector } from "react-redux";
import { type RootState } from "@/state/store";
import { useMemo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUserData } from "@/hooks/use-user-data";

export function NotificationBell() {
  const notifications = useSelector(
    (state: RootState) => state.notifications.data,
  );
  const requests = useSelector((state: RootState) => state.requests.data);
  console.log("yeaaa", requests);
  const user = useUserData();
  const pathname = usePathname();
  const isCurrentRoute = pathname === "/notifications";
  const isThereIsNewNotification = useMemo(() => {
    if (!user?.id) return;
    return (
      (notifications?.some(
        (notification) => !user?.seenNotifications.includes(notification.id),
      ) ??
        false) ||
      (requests?.length ?? 0) > 0
    );
  }, [notifications, requests?.length, user?.id, user?.seenNotifications]);
  return (
    <Link href="/notifications" className="size-full">
      <Button
        variant={isCurrentRoute ? "secondary" : "outline"}
        className="relative rounded-full"
        size="icon"
      >
        <BsBell />
        {isThereIsNewNotification && !isCurrentRoute && (
          <div className="absolute bottom-2.5 right-2.5 size-2 rounded-full bg-primary" />
        )}
      </Button>
    </Link>
  );
}
