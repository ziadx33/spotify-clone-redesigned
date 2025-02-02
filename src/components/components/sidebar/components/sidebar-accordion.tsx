import { Accordion } from "@/components/ui/accordion";
import { type ReactNode } from "react";

type SidebarAccordionProps = {
  children: ReactNode;
};

export function SidebarAccordion({ children }: SidebarAccordionProps) {
  return (
    <Accordion type="multiple" className="w-full">
      {children}
    </Accordion>
  );
}
