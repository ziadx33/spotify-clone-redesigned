"use client";

import { ChangePassword } from "@/components/change-password";
import UserRoute from "@/components/components/user-route";

export default function ChangePasswordPage() {
  return <UserRoute>{(user) => <ChangePassword user={user} />}</UserRoute>;
}
