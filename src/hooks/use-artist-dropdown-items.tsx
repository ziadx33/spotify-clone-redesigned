import { usePlaylists } from "./use-playlists";
import { type SliceType } from "@/state/types";
import { type User } from "@prisma/client";
import { useSession } from "./use-session";
import { type DropdownMenuType } from "@/types";
import { useFollow } from "./use-follow";
import { FiUserMinus, FiUserPlus } from "react-icons/fi";
import { useNavigate } from "./use-navigate";
import { MdIosShare, MdOutlineBackupTable } from "react-icons/md";

export function useArtistDropdownItems({
  artist,
  playlistId,
}: {
  artist?: User | null;
  playlistId: string;
}): SliceType<DropdownMenuType[]> {
  const { data } = usePlaylists();
  const { data: user } = useSession();

  const { isFollowed, toggle } = useFollow({ artist, playlistId });
  const navigate = useNavigate({
    data: {
      href: `/artist/${artist?.id}?playlist=${playlistId}`,
      title: artist?.name ?? "unknown",
      type: "ARTIST",
    },
    href: `/artist/${artist?.id}?playlist=${playlistId}`,
  });

  if (!user || !artist) {
    return { status: "loading", data: null, error: null };
  }

  if (data.status !== "success") return data;

  const dropdownData: DropdownMenuType[] = [
    {
      title: `open in new tab`,
      icon: MdOutlineBackupTable,
      event: () => navigate.apply({}, [, , false]),
    },
    {
      title: !isFollowed ? `follow ${artist.name}` : `unfollow ${artist.name}`,
      icon: !isFollowed ? FiUserPlus : FiUserMinus,
      event: () => void toggle(),
    },
    {
      title: "share",
      icon: MdIosShare,
      event: () =>
        void navigator.clipboard.writeText(
          `${location.origin}/artist/${artist?.id}?playlist=${playlistId}`,
        ),
    },
  ];

  const userItems: DropdownMenuType[] = [
    {
      title: "Copy link to profile",
      icon: MdIosShare,
      event: () =>
        void navigator.clipboard.writeText(
          `${location.origin}/artist/${artist?.id}`,
        ),
    },
  ];

  return {
    data: artist.type === "USER" ? userItems : dropdownData,
    error: null,
    status: "success",
  };
}
