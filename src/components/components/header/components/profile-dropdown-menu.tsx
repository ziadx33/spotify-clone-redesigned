"use client";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { AvatarData } from "../../../avatar-data";
import { Navigate } from "../../../navigate";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useSession } from "@/hooks/use-session";

export function ProfileDropdownMenu() {
  const { data: user } = useSession();
  const router = useRouter();
  const logoutHandler = async () => {
    await signOut();
    router.push("/");
  };
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <AvatarData src={user?.user?.image ?? ""} title={user?.user?.name} />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem>
          <Navigate
            data={{
              href: `/artist/${user?.user?.id}`,
              title: "Profile" ?? "unknown",
              type: "ARTIST",
            }}
            className="w-full text-start"
            href={`/artist/${user?.user?.id}`}
          >
            Profile
          </Navigate>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Navigate
            data={{
              href: `/artist/${user?.user?.id}/settings`,
              title: "Settings" ?? "unknown",
              type: "ARTIST",
            }}
            className="w-full text-start"
            href={`/artist/${user?.user?.id}/settings`}
          >
            Settings
          </Navigate>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <button onClick={logoutHandler}>Logout</button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
