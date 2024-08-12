"use client";

import { Button } from "@/components/ui/button";
import { useAddToPlaylist } from "@/hooks/use-add-to-playlist";
import { type Playlist } from "@prisma/client";
import { PlusCircle } from "lucide-react";
import { FaCircleCheck } from "react-icons/fa6";

type AddPlaylistButtonProps = {
  playlist?: Playlist | null;
  size?: number;
  divideBy?: number;
  disabled?: boolean;
};

export function AddLibraryButton({
  playlist,
  size = 35,
  divideBy = 30,
  disabled,
}: AddPlaylistButtonProps) {
  const { isLoading, toggle, isAddedToLibrary } = useAddToPlaylist({
    playlist: playlist,
  });
  return (
    <Button
      size={"icon"}
      variant="ghost"
      disabled={isLoading ?? disabled ?? !playlist}
      className="rounded-full"
      style={{
        width: `${size}px`,
        height: `${size}px`,
      }}
      onClick={toggle}
    >
      {!isAddedToLibrary ? (
        <PlusCircle size={size - divideBy} />
      ) : (
        <FaCircleCheck size={size - divideBy} />
      )}
    </Button>
  );
}
