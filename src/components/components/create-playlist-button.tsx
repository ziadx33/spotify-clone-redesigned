"use client";

import { Button } from "@/components/ui/button";
import { usePlaylists } from "@/hooks/use-playlists";
import { useSession } from "@/hooks/use-session";
import { useMutation } from "@tanstack/react-query";
import { FaSpinner } from "react-icons/fa";
import { FiPlus } from "react-icons/fi";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

export function CreatePlaylistButton() {
  const { createUserPlaylist } = usePlaylists();
  const { data: userData } = useSession();
  const user = userData?.user;
  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      await createUserPlaylist();
    },
    onError: () => toast.error("Oops! Something went wrong"),
  });

  const trigger = (
    <Button
      onClick={() => user?.type === "USER" && mutate()}
      size="icon"
      variant="ghost"
    >
      {!isPending ? (
        <FiPlus className="font-bold" />
      ) : (
        <FaSpinner className="animate-spin  font-bold" />
      )}
    </Button>
  );

  return user?.type === "USER" ? (
    trigger
  ) : (
    <DropdownMenu>
      <DropdownMenuTrigger>{trigger}</DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem>hi</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
