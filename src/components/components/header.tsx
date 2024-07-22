"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useSession } from "@/hooks/use-session";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo } from "react";
import { BsArrowLeft, BsArrowRight, BsBell } from "react-icons/bs";

export function Header() {
  const { data: user } = useSession();
  const imageFallback = useMemo(
    () =>
      user?.user?.name
        ?.split(" ")
        .slice(0, 2)
        .map((element) => element[0])
        .join(""),
    [user?.user?.name],
  );
  const router = useRouter();

  return (
    <header className="fixed z-10 flex w-[80%] justify-between px-8 pt-4">
      <div className="flex items-center gap-2">
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
      <div className="flex items-center gap-2">
        <Button variant="outline" className="rounded-full" size="icon">
          <BsBell />
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Avatar>
              <AvatarImage src={user?.user?.image ?? ""} />
              <AvatarFallback>{imageFallback}</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem asChild>
              <Link href={`/artist/${user?.user?.id}`}>Profile</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href={`/artist/${user?.user?.id}/settings`}>Settings</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href={`/auth/logout`}>Logout</Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
