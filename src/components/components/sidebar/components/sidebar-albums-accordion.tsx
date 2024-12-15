import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { usePlaylists } from "@/hooks/use-playlists";
import { usePathname } from "next/navigation";
import { RiAlbumLine } from "react-icons/ri";
import { SidebarItem } from "./sidebar-item";
import { useUserData } from "@/hooks/use-user-data";

export function SidebarAlbumsAccordion() {
  const user = useUserData();
  const { data } = usePlaylists();
  const playlists = data?.data?.filter(
    (playlist) => playlist.creatorId !== user?.id,
  );
  const pathname = usePathname();
  return (
    <AccordionItem value="item-3">
      <AccordionTrigger>
        <div className="flex items-center gap-2 px-2 text-xl">
          <RiAlbumLine size={23} />
          Albums
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
              <RiAlbumLine size={18} />
              {playlist.title}
            </SidebarItem>
          );
        })}
      </AccordionContent>
    </AccordionItem>
  );
}
