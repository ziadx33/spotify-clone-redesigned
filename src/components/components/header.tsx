"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useSession } from "@/hooks/use-session";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { type ReactNode } from "react";
import { BsArrowLeft, BsArrowRight, BsBell } from "react-icons/bs";
import { Navigate } from "../navigate";
import { AvatarData } from "../avatar-data";

export function Header({ children }: { children: ReactNode }) {
  const { data: user } = useSession();
  const router = useRouter();

  const logoutHandler = async () => {
    await signOut();
    router.push("/");
  };

  return (
    <header className="z-10 flex h-[7%] w-full justify-between py-3 pr-8">
      <div className="flex w-full max-w-[93.5%] items-center gap-3">
        {children}
        <div className="flex items-center gap-2 pr-2">
          <Button
            variant="outline"
            className="rounded-full"
            size="icon"
            onClick={() => router.back()}
          >
            <BsArrowLeft />
          </Button>
          <Button
            variant="outline"
            className="rounded-full"
            size="icon"
            onClick={() => router.forward()}
          >
            <BsArrowRight />
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="outline" className="rounded-full" size="icon">
          <BsBell />
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger>
            <AvatarData
              src={user?.user?.image ?? ""}
              title={user?.user?.name}
            />
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
      </div>
    </header>
  );
}
