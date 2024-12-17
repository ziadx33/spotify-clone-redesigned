import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { usePathname } from "next/navigation";
import { SidebarItem } from "./sidebar-item";
import { TiPinOutline } from "react-icons/ti";
import { usePrefrences } from "@/hooks/use-prefrences";

export function SidebarPinsAccordion() {
  const pathname = usePathname();
  const { data } = usePrefrences();
  return (
    <AccordionItem value="pins" className="px-2">
      <AccordionTrigger>
        <div className="flex items-center gap-2 text-xl">
          <TiPinOutline size={23} />
          Pins
        </div>
      </AccordionTrigger>
      <AccordionContent>
        {data?.pinnedHomeSections?.map((section) => {
          const parsedSection = section.split(" ").join("-");
          const isActive = pathname.startsWith(`/#${parsedSection}`);
          return (
            <SidebarItem
              active={isActive}
              key={section}
              href={`/#${parsedSection}`}
            >
              <TiPinOutline size={18} />
              {section}
            </SidebarItem>
          );
        })}
      </AccordionContent>
    </AccordionItem>
  );
}
