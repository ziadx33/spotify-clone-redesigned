"use client";

import { Button } from "@/components/ui/button";
import { useSession } from "@/hooks/use-session";
import { useUpdateUser } from "@/hooks/use-update-user";
import { createPlaylist } from "@/server/actions/playlist";
import { addPlaylist } from "@/state/slices/playlists";
import { type AppDispatch } from "@/state/store";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { FaSpinner } from "react-icons/fa";
import { FiPlus } from "react-icons/fi";
import { useDispatch } from "react-redux";
import { toast } from "sonner";

export function CreatePlaylistButton() {
  const { data: user } = useSession();
  const { update: updateUser } = useUpdateUser();
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
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
