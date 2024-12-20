import { type DropdownMenuType } from "@/types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { type ReactNode } from "react";
import { type DropdownMenuTriggerProps } from "@radix-ui/react-dropdown-menu";

type DropdownMenuItemsProps = {
  items: DropdownMenuType[];
  children: ReactNode;
};

export function DropdownMenuItems({ children, items }: DropdownMenuItemsProps) {
  const allContents: ReactNode[] = [];

  items.forEach((item) => {
    if (item.content) {
      allContents.push(item.content);
    }
    if (item.nestedMenu) {
      item.nestedMenu.items.forEach((nestedItem) => {
        if (nestedItem.content) {
          allContents.push(nestedItem.content);
        }
      });
    }
  });
  return (
    <DropdownMenu key="dropdown-menu">
      {children}
      <DropdownMenuContent className="mr-2 w-80">
        {items.map((item, index) =>
          item.nestedMenu ? (
            <DropdownMenuSub key={index}>
              <DropdownMenuSubTrigger className="flex h-fit items-center gap-2 py-2">
                <div className="w-5">
                  <item.icon size={18} />
                </div>
                {item.title}
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent className="w-60">
                {item.nestedMenu.items.map((nestedItem, nestedIndex) => (
                  <DropdownMenuItem
                    key={nestedIndex}
                    onClick={(e) => {
                      e.stopPropagation();
                      nestedItem.event && nestedItem.event(e);
                    }}
                    className="flex h-fit items-center gap-2 py-2"
                  >
                    <div className="w-5">
                      <nestedItem.icon size={18} />
                    </div>
                    {nestedItem.title}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuSubContent>
            </DropdownMenuSub>
          ) : (
            <DropdownMenuItem
              key={index}
              onClick={(e) => {
                e.stopPropagation();
                item.event && item.event(e);
              }}
              className="flex h-fit items-center gap-2 py-2"
            >
              <div className="w-5">
                <item.icon size={18} />
              </div>
              {item.title}
            </DropdownMenuItem>
          ),
        )}
      </DropdownMenuContent>
      {allContents}
    </DropdownMenu>
  );
}

const Trigger = (props: DropdownMenuTriggerProps) => {
  return <DropdownMenuTrigger {...props} />;
};

DropdownMenuItems.Trigger = Trigger;
