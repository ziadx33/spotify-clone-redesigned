import { TbBooks } from "react-icons/tb";
import { PlaylistFilters } from "./playlists-filters";
import { CreatePlaylistButton } from "./create-playlist-button";
import { usePrefrences } from "@/hooks/use-prefrences";
import { useDispatch } from "react-redux";
import { type AppDispatch } from "@/state/store";
import { editPrefrence } from "@/state/slices/prefrence";
import { editUserPrefrence } from "@/server/actions/prefrence";
import { PlaylistsSectionContainer } from "./playlists-section-container";
import { useUserData } from "@/hooks/use-user-data";

export function PlaylistSection() {
  const { data } = usePrefrences();
  const dispatch = useDispatch<AppDispatch>();
  const user = useUserData();
  const buttonHandler = async () => {
    const usedData = { showSidebar: !data?.showSidebar };
    dispatch(editPrefrence(usedData));
    await editUserPrefrence({
      data: usedData,
      userId: user.id,
    });
  };
  return (
    <PlaylistsSectionContainer>
      <div className="mb-4 flex items-center justify-between px-2">
        <button
          disabled={!user?.id}
          onClick={buttonHandler}
          className="flex gap-2 text-lg font-semibold"
        >
          <TbBooks size={30} />
          {!data?.showSidebar && <h3>Your library</h3>}
        </button>
        <CreatePlaylistButton />
      </div>
      <PlaylistFilters />
    </PlaylistsSectionContainer>
  );
}
