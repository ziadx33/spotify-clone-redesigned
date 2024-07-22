"use client";

import { Button } from "@/components/ui/button";
import { useSession } from "@/hooks/use-session";
import { useUpdateUser } from "@/hooks/use-update-user";
import { createPlaylist } from "@/server/actions/playlist";
import { addPlaylist } from "@/state/slices/playlists";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FaSpinner } from "react-icons/fa";
import { FiPlus } from "react-icons/fi";
import { useDispatch } from "react-redux";

export function CreatePlaylistButton() {
  const { data: user } = useSession();
  const { update: updateUser } = useUpdateUser();
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();
  const handleCreatePlaylist = async () => {
    setIsLoading(true);
    const createdPlaylist = await createPlaylist(user);
    const playlistsData = [
      ...(user?.user?.playlists ?? []),
      createdPlaylist.id,
    ];
    await updateUser({
      data: {
        playlists: playlistsData,
      },
    });
    dispatch(addPlaylist(createdPlaylist));
    router.push(`/playlist/${createdPlaylist.id}`);
    setIsLoading(false);
  };
  return (
    <Button onClick={handleCreatePlaylist} size="icon" variant="ghost">
      {!isLoading ? (
        <FiPlus className="font-bold" />
      ) : (
        <FaSpinner className="font-bold" />
      )}
    </Button>
  );
}
