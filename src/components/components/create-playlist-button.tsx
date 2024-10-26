"use client";

import { Button } from "@/components/ui/button";
import { usePlaylists } from "@/hooks/use-playlists";
import { useMutation } from "@tanstack/react-query";
import { FaSpinner } from "react-icons/fa";
import { FiPlus } from "react-icons/fi";
import { toast } from "sonner";

export function CreatePlaylistButton() {
  const { createUserPlaylist } = usePlaylists();
  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      await createUserPlaylist();
    },
    onError: () => toast.error("Oops! Something went wrong"),
  });

  return (
    <Button onClick={() => mutate()} size="icon" variant="ghost">
      {!isPending ? (
        <FiPlus className="font-bold" />
      ) : (
        <FaSpinner className="animate-spin  font-bold" />
      )}
    </Button>
  );
}
