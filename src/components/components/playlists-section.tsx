import { TbBooks } from "react-icons/tb";
import { PlaylistFilters } from "./playlists-filters";
import { CreatePlaylistButton } from "./create-playlist-button";
import { cn } from "@/lib/utils";
import { usePrefrences } from "@/hooks/use-prefrences";
import { useDispatch } from "react-redux";
import { type AppDispatch } from "@/state/store";
import { editPrefrence } from "@/state/slices/prefrence";
import { editUserPrefrence } from "@/server/actions/prefrence";
import { useSession } from "@/hooks/use-session";
import { useDrop } from "@/hooks/use-drop";
import { useFollow } from "@/hooks/use-follow";
import { getArtistById } from "@/server/actions/user";
import { toast } from "sonner";
import { useState } from "react";

export function PlaylistSection() {
  const { data, error } = usePrefrences();
  const dispatch = useDispatch<AppDispatch>();
  const { data: user } = useSession();
  const buttonHandler = async () => {
    const usedData = { showSidebar: !data?.showSidebar };
    dispatch(editPrefrence(usedData));
    await editUserPrefrence({
      data: usedData,
      error,
      type: "set",
      userId: user!.user!.id,
    });
  };
  const { follow } = useFollow({ playlistId: "unkown" });
  const [isDropping, setIsDropping] = useState(false);
  const { ref } = useDrop<HTMLDivElement>(
    "artistId",
    async (id) => {
      setIsDropping(false);
      const artist = await getArtistById(id);
      if (user?.user?.id && artist?.followers.includes(user?.user?.id))
        return toast.error("already followed artist");
      if (!artist) return toast.error("Something went wrong");
      await follow(artist);
      toast.success(`Followed ${artist.name} successfully!`);
    },
    () => {
      setIsDropping(true);
    },
    (e) => {
      if (!e.currentTarget.contains(e.relatedTarget as Node)) {
        setIsDropping(false);
      }
    },
  );
  return (
    <div
      className={cn(
        "rounded-lg border-2 border-transparent transition-all",
        isDropping ? "border-primary" : "border-transparent",
        data?.showSidebar ? "w-24 px-2" : "w-full px-4",
      )}
      ref={ref}
    >
      <div className="mb-4 flex items-center justify-between">
        <button
          disabled={!user?.user?.id}
          onClick={buttonHandler}
          className="flex gap-2 text-lg font-semibold"
        >
          <TbBooks size={30} />
          {!data?.showSidebar && <h3>Your library</h3>}
        </button>
        <CreatePlaylistButton />
      </div>
      <PlaylistFilters />
    </div>
  );
}
