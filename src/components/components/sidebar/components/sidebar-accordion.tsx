import { Accordion } from "@/components/ui/accordion";
import {
  type Dispatch,
  type SetStateAction,
  useState,
  type ReactNode,
} from "react";

type SidebarAccordionProps = {
  children: (
    value: string[],
    setValue: Dispatch<SetStateAction<string[]>>,
  ) => ReactNode;
};

export function SidebarAccordion({ children }: SidebarAccordionProps) {
  const [value, setValue] = useState<string[]>([]);

  return (
    <Accordion
      type="multiple"
      className="w-full"
      onValueChange={setValue}
      value={value}
    >
      {children(value, setValue)}
    </Accordion>
  );
}
