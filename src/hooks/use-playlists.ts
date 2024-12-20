import { createPlaylist } from "@/server/actions/playlist";
import { type AppDispatch, type RootState } from "@/state/store";
import { useDispatch, useSelector } from "react-redux";
import { useUpdateUser } from "./use-update-user";
import { addPlaylist } from "@/state/slices/playlists";
import { useRouter } from "next/navigation";

export function usePlaylists() {
  const data = useSelector((state: RootState) => state.playlists);
  const { update: updateUser, user } = useUpdateUser();
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const createUserPlaylist = async (
    data: Parameters<typeof createPlaylist>["0"],
  ) => {
    const createdPlaylist = await createPlaylist(data);
    const playlistsData = [...(user?.playlists ?? []), createdPlaylist.id];
    await updateUser({
      data: {
        playlists: playlistsData,
      },
    });
    dispatch(addPlaylist(createdPlaylist));
    router.push(`/playlist/${createdPlaylist.id}`);
  };
  return { data, createUserPlaylist };
}
