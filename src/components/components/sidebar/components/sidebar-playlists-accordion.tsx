import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { usePlaylists } from "@/hooks/use-playlists";
import { RiFolderMusicLine } from "react-icons/ri";
import { SidebarItem } from "./sidebar-item";
import { usePathname } from "next/navigation";
import { useUserData } from "@/hooks/use-user-data";
import { PlaylistContext } from "@/components/contexts/playlist-context";

export function SidebarPlaylistsAccordion() {
  const user = useUserData();
  const { data } = usePlaylists();
  const playlists = data?.data?.filter(
    (playlist) => playlist.creatorId === user?.id,
  );
  const pathname = usePathname();
  return (
    <AccordionItem value="playlists" className="px-2">
      <AccordionTrigger>
        <div className="flex items-center gap-2 text-xl">
          <RiFolderMusicLine size={23} />
          Playlists
        </div>
      </AccordionTrigger>
      <AccordionContent>
        {playlists?.map((playlist) => {
          const isActive = pathname.startsWith(`/playlist/${playlist.id}`);
          return (
            <PlaylistContext
              playlist={playlist}
              asChild={false}
              key={playlist.id}
            >
              <SidebarItem active={isActive} href={`/playlist/${playlist.id}`}>
                <RiFolderMusicLine size={18} />
                {playlist.title}
              </SidebarItem>
            </PlaylistContext>
          );
        })}
      </AccordionContent>
    </AccordionItem>
  );
}
