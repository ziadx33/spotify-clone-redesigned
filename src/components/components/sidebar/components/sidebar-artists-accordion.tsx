import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useFollowing } from "@/hooks/use-following";
import { usePathname } from "next/navigation";
import { PiMicrophoneStageBold } from "react-icons/pi";
import { SidebarItem } from "./sidebar-item";
import { AuthorContext } from "@/components/contexts/author-context";
import { useMemo } from "react";

export function SidebarArtistsAccordion() {
  const { data } = useFollowing();
  const pathname = usePathname();
  // const {follow} = useFollow({playlistId: "sidebar"});
  // const test = useDrop("artistId", (artist) => follow(artist));
  const items = useMemo(() => {
    return data?.map((artist) => {
      const isActive = pathname.startsWith(`/artist/${artist.id}`);
      return (
        <AuthorContext
          artist={artist}
          playlistId="sidebar"
          asChild={false}
          key={artist.id}
        >
          <SidebarItem
            active={isActive}
            href={`/artist/${artist.id}?playlist=sidebar`}
          >
            <PiMicrophoneStageBold size={18} />
            {artist.name}
          </SidebarItem>
        </AuthorContext>
      );
    });
  }, [data, pathname]);

  return (
    <AccordionItem value="artists" className="px-2">
      <AccordionTrigger>
        <div className="flex items-center gap-2 text-xl">
          <PiMicrophoneStageBold size={23} />
          Artists
        </div>
      </AccordionTrigger>
      <AccordionContent>{items}</AccordionContent>
    </AccordionItem>
  );
}
