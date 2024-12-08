import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { usePlaylists } from "@/hooks/use-playlists";
import { useSession } from "@/hooks/use-session";
import { RiFolderMusicLine } from "react-icons/ri";
import { SidebarItem } from "./sidebar-item";
import { usePathname } from "next/navigation";

export function SidebarPlaylistsAccordion() {
  const { data: user } = useSession();
  const { data } = usePlaylists();
  const playlists = data?.data?.filter(
    (playlist) => playlist.creatorId === user?.user?.id,
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
