"use client";

import { Button } from "@/components/ui/button";
import { usePlaylists } from "@/hooks/use-playlists";
import { useMutation } from "@tanstack/react-query";
import { FaSpinner } from "react-icons/fa";
import { FiPlus } from "react-icons/fi";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../../ui/dropdown-menu";
import { useUserData } from "@/hooks/use-user-data";

export function CreatePlaylistButton() {
  const { createUserPlaylist } = usePlaylists();
  const user = useUserData();
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
