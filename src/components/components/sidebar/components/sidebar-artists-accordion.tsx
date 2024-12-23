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
import { useFollow } from "@/hooks/use-follow";
import { useDrop } from "@/hooks/use-drop";
import { getUserById } from "@/server/actions/verification-token";
import { toast } from "sonner";

export function SidebarArtistsAccordion() {
  const { data } = useFollowing();
  const pathname = usePathname();
  const { follow } = useFollow({ playlistId: "sidebar" });
  const { ref: dropRef } = useDrop<HTMLDivElement>(
    "artistId",
    async (artistId) => {
      const user = await getUserById({ id: artistId });
      toast.promise(follow(user), {
        loading: "Following artist...",
        success: "Artist followed!",
        error: "Failed to follow artist",
      });
    },
  );
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
    <AccordionItem value="artists" className="px-2" ref={dropRef}>
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
