import { usePlaylists } from "@/hooks/use-playlists";
import { type Folder } from "@prisma/client";
import { SidebarItem } from "./sidebar-item";
import { usePathname } from "next/navigation";
import { RiFolderMusicLine } from "react-icons/ri";
import { PlaylistContext } from "@/components/contexts/playlist-context";

export function FolderPlaylists({ folder }: { folder: Folder }) {
  const {
    data: { data: playlists },
  } = usePlaylists();
  const pathname = usePathname();
  return (
    playlists
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      ?.filter((playlist) => folder.playlistIds.includes(playlist.id))
      .map((playlist) => {
        const isActive = pathname.startsWith(`/playlist/${playlist.id}`);
        return (
          <PlaylistContext
            playlist={playlist}
            asChild={false}
            key={playlist.id}
          >
            <SidebarItem
              className="text-xs"
              active={isActive}
              href={`/playlist/${playlist.id}`}
            >
              <RiFolderMusicLine size={18} />
              {playlist.title}
            </SidebarItem>
          </PlaylistContext>
        );
      })
  );
}
