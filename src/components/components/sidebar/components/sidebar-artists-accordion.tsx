import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useFollowing } from "@/hooks/use-following";
import { usePathname } from "next/navigation";
import { PiMicrophoneStageBold } from "react-icons/pi";
import { SidebarItem } from "./sidebar-item";

export function SidebarArtistsAccordion() {
  const { data } = useFollowing();
  const pathname = usePathname();
  return (
    <AccordionItem value="item-1">
      <AccordionTrigger>
        <div className="flex items-center gap-2 text-xl">
          <PiMicrophoneStageBold size={23} />
          Artists
        </div>
      </AccordionTrigger>
      <AccordionContent>
        {data?.map((artist) => {
          const isActive = pathname.startsWith(`/artist/${artist.id}`);
          return (
            <SidebarItem
              active={isActive}
              key={artist.id}
              href={`/artist/${artist.id}?playlist=sidebar`}
            >
              <PiMicrophoneStageBold size={18} />
              {artist.name}
            </SidebarItem>
          );
        })}
      </AccordionContent>
    </AccordionItem>
  );
}
