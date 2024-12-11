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

export function SidebarPlaylistsAccordion() {
  const user = useUserData();
  const { data } = usePlaylists();
  const playlists = data?.data?.filter(
    (playlist) => playlist.creatorId === user?.id,
  );
  const pathname = usePathname();
  return (
    <AccordionItem value="item-2">
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
            <SidebarItem
              active={isActive}
              key={playlist.id}
              href={`/playlist/${playlist.id}`}
            >
              <RiFolderMusicLine size={18} />
              {playlist.title}
            </SidebarItem>
          );
        })}
      </AccordionContent>
    </AccordionItem>
  );
}
