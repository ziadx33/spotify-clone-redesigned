import { type DropdownMenuType } from "@/types";
import { Fragment, useMemo, type ReactNode } from "react";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from "./ui/context-menu";
import { type ContextMenuTriggerProps } from "@radix-ui/react-context-menu";

type ContextMenuItemsProps = {
  items: DropdownMenuType[];
  children?: ReactNode;
};

export function DropdownContextItems({
  items,
  children,
}: ContextMenuItemsProps) {
  const allContent = useMemo(() => {
    const content: ReactNode[] = [];

    items.forEach((item) => {
      if (item.content) {
        content.push(item.content);
      }
      if (item.nestedMenu) {
        item.nestedMenu.items.forEach((nestedItem) => {
          if (nestedItem.content) {
            content.push(nestedItem.content);
          }
        });
      }
    });
    return content;
  }, [items]);

  return (
    <Fragment key="dropdown-context-items">
      <ContextMenu>
        {children}
        <ContextMenuContent className="mr-2 w-80">
          {items.map((item, index) =>
            item.nestedMenu ? (
              <ContextMenuSub key={index}>
                <ContextMenuSubTrigger className="flex h-fit items-center gap-2 py-2">
                  <div className="w-5">
                    <item.icon size={18} />
                  </div>
                  {item.title}
                </ContextMenuSubTrigger>
                <ContextMenuSubContent className="w-60">
                  {item.nestedMenu.items.map((nestedItem, nestedIndex) => (
                    <ContextMenuItem
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
                    </ContextMenuItem>
                  ))}
                </ContextMenuSubContent>
              </ContextMenuSub>
            ) : (
              <ContextMenuItem
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
              </ContextMenuItem>
            ),
          )}
        </ContextMenuContent>
      </ContextMenu>

      {allContent}
    </Fragment>
  );
}

const Trigger = (props: ContextMenuTriggerProps) => {
  return <ContextMenuTrigger {...props} />;
};

DropdownContextItems.Trigger = Trigger;
