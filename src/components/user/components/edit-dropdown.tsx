"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { type User } from "@prisma/client";
import { BsThreeDots, BsPen, BsCopy } from "react-icons/bs";
import { EditProfile } from "./edit-profile";
import { useState } from "react";

export function EditDropdown({ userData }: { userData?: User }) {
  const [dropdownOpen, setDropdownClose] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  return (
    <DropdownMenu
      open={dropdownOpen}
      onOpenChange={(e) => setDropdownClose(e ? e : dialogOpen)}
    >
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="w-fit">
          <BsThreeDots size={30} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <Dialog onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <DropdownMenuItem>
              <BsPen className="mr-2" />
              Edit Profile
            </DropdownMenuItem>
          </DialogTrigger>
          <DialogContent className="h-[30rem] w-[90%] max-w-[50rem]">
            <DialogTitle />
            <EditProfile user={userData} />
          </DialogContent>
        </Dialog>
        <DropdownMenuItem
          onClick={() =>
            navigator.clipboard.writeText(
              `${window.origin}/artist/${userData?.id}`,
            )
          }
        >
          <BsCopy className="mr-2" />
          Copy link to profile
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
