import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { type User } from "@prisma/client";
import { DialogTrigger } from "@radix-ui/react-dialog";
import { BsThreeDots, BsPen, BsCopy } from "react-icons/bs";

export function EditDropdown({ userData }: { userData?: User }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="w-fit">
          <BsThreeDots size={30} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DialogTrigger asChild>
          <DropdownMenuItem>
            <BsPen className="mr-2" />
            Edit Profile
          </DropdownMenuItem>
        </DialogTrigger>
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
