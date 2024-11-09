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
import { revalidate } from "@/server/actions/revalidate";

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
    revalidate("/");
  };
  return (
    <div className={cn("", data?.showSidebar ? "w-24 px-2" : "w-full px-4")}>
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
