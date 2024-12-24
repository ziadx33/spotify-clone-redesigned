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
  const { follow, isFollowed } = useFollow({ playlistId: "sidebar" });
  const { ref: dropRef } = useDrop<HTMLDivElement>(
    "artistId",
    async (artistId) => {
      dropRef.current?.classList.add("border-transparent");
      dropRef.current?.classList.remove("border-primary");
      const user = await getUserById({ id: artistId });
      if (!isFollowed) {
        toast.promise(follow(user), {
          loading: "Following artist...",
          success: "Artist followed!",
          error: "Failed to follow artist",
        });
      } else {
        toast.error("user already followed");
      }
    },
    () => {
      dropRef.current?.classList.remove("border-transparent");
      dropRef.current?.classList.add("border-primary");
    },
    (e) => {
      if (!e.currentTarget.contains(e.relatedTarget as Node)) {
        dropRef.current?.classList.add("border-transparent");
        dropRef.current?.classList.remove("border-primary");
      }
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
    <AccordionItem
      value="artists"
      className="rounded-md border-2 border-transparent px-2 transition-colors duration-200 ease-in-out"
      ref={dropRef}
    >
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
