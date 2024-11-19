import { Notifications } from "@/components/notifications";
import { type Metadata } from "next";

export const metadata: Metadata = {
  title: "Spotify Clone - Notifications",
  description:
    "Notifications, here you can see the latest releases from artists you follow.",
};

export default function NotificationsPage() {
  return <Notifications />;
}
