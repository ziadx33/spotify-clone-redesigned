"use client";

import { Settings } from "@/components/settings";
import { useSession } from "@/hooks/use-session";

export default function SettingsPage() {
  const { data: user } = useSession();
  return <Settings user={user?.user} />;
}
