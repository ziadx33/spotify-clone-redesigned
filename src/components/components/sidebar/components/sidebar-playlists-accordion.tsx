import { SidebarItemAccordion } from "./sidebar-item-accordion";
import { RiFolderMusicLine } from "react-icons/ri";
import { usePlaylists } from "@/hooks/use-playlists";
import { useUserData } from "@/hooks/use-user-data";
import { SidebarItem } from "./sidebar-item";
import { usePathname } from "next/navigation";
import { Input } from "@/components/ui/input";

export function SidebarPlaylistsAccordion() {
  const user = useUserData();
  const { data, createUserPlaylist } = usePlaylists();
  const playlists =
    data?.data?.filter(
      (playlist) =>
        playlist.creatorId === user?.id && playlist.type === "PLAYLIST",
    ) ?? [];
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
      onCreate={(value) =>
        createUserPlaylist({
          title: value ?? "New Playlist",
          creatorId: user.id,
          description: "",
        })
      }
      customCreateUI={(onCreate) => (
        <SidebarItem key={"creating"}>
          <div className="flex">
            <RiFolderMusicLine size={18} />
            <Input
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  onCreate(e, e.currentTarget.value);
                }
              }}
              placeholder="enter playlist name..."
              className="h-5 border-none bg-transparent pl-0 focus-visible:ring-0 focus-visible:ring-offset-0"
            />
          </div>
        </SidebarItem>
      )}
    />
  );
}
