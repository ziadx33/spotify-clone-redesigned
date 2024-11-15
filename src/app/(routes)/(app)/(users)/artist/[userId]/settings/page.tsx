"use client";

import UserRoute from "@/components/components/user-route";
import { Settings } from "@/components/settings";

export default function SettingsPage() {
  return <UserRoute>{(user) => <Settings user={user} />}</UserRoute>;
}
