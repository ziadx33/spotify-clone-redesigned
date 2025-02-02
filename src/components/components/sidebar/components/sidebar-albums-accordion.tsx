import { SidebarItemAccordion } from "./sidebar-item-accordion";
import { RiAlbumLine } from "react-icons/ri";
import { usePlaylists } from "@/hooks/use-playlists";
import { useUserData } from "@/hooks/use-user-data";
import { usePathname } from "next/navigation";
import { SidebarItem } from "./sidebar-item";

export function SidebarAlbumsAccordion() {
  const user = useUserData();
  const { data } = usePlaylists();
  const albums =
    data?.data?.filter((playlist) => playlist.creatorId !== user?.id) ?? [];
  const pathname = usePathname();

  return (
    <SidebarItemAccordion
      title="Albums"
      icon={<RiAlbumLine size={18} />}
      items={albums}
      filterKey="title"
      renderItem={(album) => (
        <SidebarItem
          active={pathname.startsWith(`/playlist/${album.id}`)}
          key={album.id}
          href={`/playlist/${album.id}`}
        >
          <RiAlbumLine size={18} />
          {album.title}
        </SidebarItem>
      )}
      createLink={user.type === "ARTIST" ? "/albums/new" : undefined}
    />
  );
}
