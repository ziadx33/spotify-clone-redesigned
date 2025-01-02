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
import { FaPlus } from "react-icons/fa";
import Link from "next/link";

export function SidebarAlbumsAccordion() {
  const user = useUserData();
  const { data } = usePlaylists();
  const playlists = data?.data?.filter(
    (playlist) => playlist.creatorId !== user?.id,
  );
  const pathname = usePathname();
  return (
    <AccordionItem value="albums" className="px-2">
      <AccordionTrigger>
        <div className="flex w-full items-center justify-between pr-2">
          <div className="flex items-center gap-2 text-xl">
            <RiAlbumLine size={18} />
            Albums
          </div>
          {user.type === "ARTIST" && (
            <Link
              href="/albums/new"
              className="grid h-full w-8 place-items-center transition-all duration-300"
            >
              <FaPlus size={13} />
            </Link>
          )}
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
