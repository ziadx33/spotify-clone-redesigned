/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Button } from "@/components/ui/button";
import { type Session } from "@/hooks/use-session";
import { useUpdateUser } from "@/hooks/use-update-user";
import { removePlaylist, addPlaylist } from "@/state/slices/playlists";
import { type Playlist } from "@prisma/client";
import { PlusCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FaCircleCheck } from "react-icons/fa6";
import { useDispatch } from "react-redux";

export function AddLibraryButton({
  user,
  playlist,
}: {
  user: Session | null;
  playlist: Playlist | null;
}) {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
  const isAddedToLibrary = user?.user?.playlists?.includes(playlist?.id ?? "");
  const { update: updateUser } = useUpdateUser();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleRemovePlaylist = async () => {
    setIsLoading(true);
    const data = {
      playlists:
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
        user?.user?.playlists?.filter((playlist) => playlist !== playlist) ??
        [],
    };
    await updateUser({
      data,
    });
    router.prefetch("/");
    router.prefetch(`/artist/${playlist?.creatorId}`);
    dispatch(removePlaylist(playlist?.id ?? ""));
    setIsLoading(false);
  };

  const handleAddPlaylist = async () => {
    setIsLoading(true);
    const data = {
      playlists: [...(user?.user?.playlists ?? []), playlist?.id ?? ""],
    };
    router.prefetch("/");
    router.prefetch(`/artist/${playlist?.creatorId}`);
    await updateUser({
      data,
    });
    dispatch(addPlaylist(playlist!));
    setIsLoading(false);
  };
  return (
    <Button
      size={"icon"}
      variant="ghost"
      disabled={isLoading}
      className="h-16 w-16 rounded-full"
      onClick={isAddedToLibrary ? handleRemovePlaylist : handleAddPlaylist}
    >
      {/* eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access */}
      {!isAddedToLibrary ? (
        <PlusCircle size={35} />
      ) : (
        <FaCircleCheck size={35} />
      )}
    </Button>
  );
}
