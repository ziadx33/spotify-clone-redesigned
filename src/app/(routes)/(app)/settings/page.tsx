"use client";

import { Settings } from "@/components/settings";
import { useUserData } from "@/hooks/use-user-data";

export default function SettingsPage() {
  const user = useUserData();
  return <Settings user={user} />;
}
