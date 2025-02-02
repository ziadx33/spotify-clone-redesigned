import { SidebarItemAccordion } from "./sidebar-item-accordion";
import { RiFolderMusicLine } from "react-icons/ri";
import { usePlaylists } from "@/hooks/use-playlists";
import { useUserData } from "@/hooks/use-user-data";
import { SidebarItem } from "./sidebar-item";
import { usePathname } from "next/navigation";

export function SidebarPlaylistsAccordion() {
  const user = useUserData();
  const { data, createUserPlaylist } = usePlaylists();
  const playlists =
    data?.data?.filter((playlist) => playlist.creatorId === user?.id) ?? [];
  const pathname = usePathname();

  return (
    <SidebarItemAccordion
      title="Playlists"
      icon={<RiFolderMusicLine size={18} />}
      items={playlists}
      filterKey="title"
      renderItem={(playlist) => (
        <SidebarItem
          active={pathname.startsWith(`/playlist/${playlist.id}`)}
          key={playlist.id}
          href={`/playlist/${playlist.id}`}
        >
          <RiFolderMusicLine size={18} />
          {playlist.title}
        </SidebarItem>
      )}
      onCreate={() =>
        createUserPlaylist({
          title: "New Playlist",
          creatorId: user.id,
          description: "",
        })
      }
    />
  );
}
